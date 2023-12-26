import fs from "fs";
const precache_list = [];
let dirs = fs.readdirSync("./public/public", { withFileTypes: true });
let len = 0;
for (const folder of dirs) {
    if (folder.isDirectory()) {
        let files = fs.readdirSync(`./public/public/${folder.name}`, {
            withFileTypes: true,
            recursive: true,
        });
        const datenow = Date();
        for (const file of files) {
            if (file.isDirectory()) continue;
            const revision = file.name + datenow;
            precache_list.push({
                url: `/public/${folder.name}/${file.name}`,
                revision,
            });
            len++;
        }
    }
}
// console.log(precache_list);

fs.writeFileSync("./src/precache_list.json", JSON.stringify(precache_list));
console.log(`generated ${len} precache list`);
