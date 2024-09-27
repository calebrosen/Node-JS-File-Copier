
# Simple NodeJS File Copier
This is a simple NodeJS FTP file copier. Upon posting to the URL, it takes the parameters 'websiteToMoveTo' (an alias for a website), and 'filePath'. In the 'case', add your website aliases and the FTP login information.

#### While this is hard coded to take one website and copy to others (which is the only thing I needed it for), it can easily be modified to make it dynamic and work both ways.

## Installation

```bash
npm install basic-ftp
```
    
## Variables

Set these variables:
```
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



// Set your master FTP here.
await client.access({
    host: '',
    user: '',
    password: '',
});
```
## 🔗 Dependency Documentation

- [Basic FTP] (https://www.npmjs.com/package/basic-ftp/)
