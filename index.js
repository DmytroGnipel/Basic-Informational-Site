import fs from "fs";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.get("/(:pagename)?", async (req, res) => {
  //check wether is :pagename or not, if not then :pagename = 'index'
  //to get path to page/index/content.html and page/index/title.html
  let name = req.params.pagename ?? "index";

  //if request is point to images, css, client js etc.
  if (name.match(/\.[a-z]+$/)) {
    res.sendFile(__dirname + "/root/" + name);
  } else {
    //if request is point to html-page
    let titlePath = "page/" + name + "/title.html";
    let contentPath = "page/" + name + "/content.html";

    let layoutPath = "layout.html";
    let headerPath = "elems/header.html";
    let asidePath = "elems/aside.html";
    let footerPath = "elems/footer.html";

    let layout = await fs.promises.readFile(layoutPath, "utf8");
    let header = await fs.promises.readFile(headerPath, "utf8");
    let aside = await fs.promises.readFile(asidePath, "utf8");
    let footer = await fs.promises.readFile(footerPath, "utf8");
    let title = await fs.promises.readFile(titlePath, "utf8");
    let content = await fs.promises.readFile(contentPath, "utf8");

    layout = layout.replace(/{% get title %}/, title);
    layout = layout.replace(/{% get content %}/, content);
    layout = layout.replace(/{% get header %}/, header);
    layout = layout.replace(/{% get aside %}/, aside);
    layout = layout.replace(/{% get footer %}/, footer);

    res.send(layout);
  }
});

app.listen(3000, () => {
  console.log("I am running");
});
