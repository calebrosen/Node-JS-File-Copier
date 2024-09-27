const fs = require("fs");
const { Client } = require("basic-ftp");


// Catching API Call - Change "your_api_call_url_here" to your URL that you wish to post to.
// Pass 'websiteToMoveTo' and 'filePath' with your post.
app.post("/your_api_call_url_here", async (req, res) => {
  const { websiteToMoveTo, filePath } = req.body;
  if (!websiteToMoveTo || !filePath) {
    return res.status(400).send("Website and file path are required");
  }

  // There is a bug with simple-ftp that doesn't allow you to create/edit/delete directories and then transfer files afterwards.
  // Bug link: https://github.com/SamKirkland/FTP-Deploy-Action/issues/262

  // So, I am splitting it into two steps. This avoids that bug.
  try {
    const firstStepResult = await moveFiles(websiteToMoveTo, filePath, 1);

    console.log("First step result:", firstStepResult);

    const secondStepResult = await moveFiles(websiteToMoveTo, filePath, 2);

    console.log("Second step result:", secondStepResult);

    res.status(200).send('Files moved successfully in both steps');
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Failed to move Files');
  }
});

async function moveFiles(websiteToMoveTo, filePath, step) {
  const client = new Client();
  client.ftp.verbose = true;
  let moveToClient = null;
  let storeHost, storeUser, storePW;

  // Set your FTP login information to the websites you are copying to here.
  // Change 'case' to the website parameter you are sending
  // Add more cases depending on what you are copying to
  switch (websiteToMoveTo.trim()) {
    case "Store1":
      websiteHost = '';
      websiteUser = '';
      websitePW = '';
      break;
    case "Store2":
      websiteHost = '';
      websiteUser = '';
      websitePW = '';
        break;
    default:
      return "Website wasn't set in moveImages function.";
  }

  try {
    if (step == 1) {

      // Accessing master source FTP.
      // Set your master FTP here.
      await client.access({
        host: '',
        user: '',
        password: '',
      });

      // Creating exact Local Directory path
      const localDir = path.dirname(filePath);
      fs.mkdirSync(localDir, { recursive: true });

      // Downloading Image to exact path
      await client.downloadTo(filePath, filePath);


      moveToClient = new Client();
      moveToClient.ftp.verbose = true;

      // Accessing FTP on target website
      await moveToClient.access({
        host: storeHost,
        user: storeUser,
        password: storePW,
      });

      // Extracting the directory path
      const directoryPath = filePath.substring(
        0,
        filePath.lastIndexOf("/") + 1
      );

      // Creating the directory path on the target website to if it doesn't exist
      await moveToClient.ensureDir(directoryPath);

      return "Step 1: File downloaded";
    } else if (step == 2) {

      if (!moveToClient) {
        moveToClient = new Client();
        moveToClient.ftp.verbose = true;
        await moveToClient.access({
          host: websiteHost,
          user: websiteUser,
          password: websitePW,
        });
      }

      // Uploading the image to the target website
      await moveToClient.uploadFrom(filePath, filePath);

      return "Step 2: File uploaded";
    }
  } catch (err) {
    console.log("Error in moveFiles:", err);
  } finally {
    client.close();
    if (moveToClient) {
      moveToClient.close();
    }
  }
}