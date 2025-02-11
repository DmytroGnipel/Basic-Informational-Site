import fs from "fs";
import http from "http";
import getMimeType from "./getMimeType.js";

http
  .createServer(async (req, res) => {
    let output;
    let path;
    let status = 200;
    try {
      //remove extension from req.url and get path without extension
      if (Array.isArray(req.url.match(/\.[a-z]+$/))) {
        path = req.url.slice(1);
        output = await fs.promises.readFile(path);
      }
      //get path and output when request points to html-document
      else {
        let layoutPath = "layout.html";
        let titlePath;
        let contentPath;
        //when request points to main page
        if (req.url === "/") {
          titlePath = "page/index/title.html";
          contentPath = "page/index/content.html";
        }
        //when request points to not main page
        else {
          titlePath = "page" + req.url + "/title.html";
          contentPath = "page" + req.url + "/content.html";
        }

        let headerPath = "elems/header.html";
        let asidePath = "elems/aside.html";
        let footerPath = "elems/footer.html";

        let layout = await fs.promises.readFile(layoutPath, "utf8");
        let title = await fs.promises.readFile(titlePath, "utf8");
        let content = await fs.promises.readFile(contentPath, "utf8");
        let header = await fs.promises.readFile(headerPath, "utf8");
        let aside = await fs.promises.readFile(asidePath, "utf8");
        let footer = await fs.promises.readFile(footerPath, "utf8");

        layout = layout.replace(/{% get title %}/, title);
        layout = layout.replace(/{% get content %}/, content);
        layout = layout.replace(/{% get header %}/, header);
        layout = layout.replace(/{% get aside %}/, aside);
        layout = layout.replace(/{% get footer %}/, footer);

        output = layout;
        path = layoutPath;
      }
    } catch (err) {
      status = 404;
      path = "page/404.html";
      output = await fs.promises.readFile(path, "utf8");
    }

    res.writeHead(status, { "Content-Type": getMimeType(path) });
    res.write(output);
    res.end();
  })
  .listen(8080);
