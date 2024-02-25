/*
    shitty mod loader
*/

// we need some useful functions
const rotisserie = {
    tooltip: function(text, inptype = "blue") {
        let type = 'noticeInfo-3v29SJ'
        switch(inptype) {
            case "green":
                type = 'noticeSuccess-P1EnBb';break;
            case "red":
                type = 'noticeDanger-1SIxaf';break;
            case "purple":
                type = 'noticeStreamerMode-1OlfKV';break;
            case "dark-blue":
                type = 'noticeFacebook-1eAoSW';break;
            case "blurple":
                type = 'noticeBrand-3o3fQA';break; 
            case "orange":
                type = 'noticeDefault-16Om2m';break; 
            case "spotify":
                type ='noticeSpotify-27AKmv';break;
            default: 
                type = 'noticeInfo-3v29SJ'
                break
        }
        document.querySelector('.tooltips').innerHTML = `
            <div class="flexChild-1KGW5q" style="flex: 0 0 auto;">
                <div>
                    <div class="${type} notice-3I4-y_ size14-1wjlWP weightMedium-13x9Y8 height36-13sPn7">
                        <div class="dismiss-1QjyJW" onclick="console.log(this);"></div>
                        ${text}
                    </div>
                </div>
            </div>` + document.querySelector('.tooltips').innerHTML
        const lele = document.querySelectorAll(".dismiss-1QjyJW")
        lele.forEach(item => {
            item.addEventListener("click", function() {
                var parentElement = item.parentElement.parentElement.parentElement;
                parentElement.remove();
            });
        })
    }
}

// shorterhand variables
const rts = rotisserie
const rt = rotisserie
const chicken = rotisserie // lol

const loader_funcs = {
    verifyMod: function(modDetails) {
        const requiredFields = [
            'name',
            'description',
            'version',
            'creator',
            'class_to_look_for',
            'does_look_for_classes',
            'custom_message'
        ];

        let missingFields = [];
        let booleanFields = ['does_look_for_classes', 'custom_message'];
        let stringFields = ['name', 'description', 'version', 'creator', 'class_to_look_for'];

        for (const field of requiredFields) {
            if (!modDetails.hasOwnProperty(field)) {
                missingFields.push(field);
            } else {
                const value = modDetails[field];
                if (booleanFields.includes(field) && typeof value !== 'boolean') {
                    return { error: true, message: `Invalid type for ${field}. Expected boolean.` };
                } else if (!booleanFields.includes(field) && typeof value !== 'string') {
                    return { error: true, message: `Invalid type for ${field}. Expected string.` };
                }
            }
        }

        if (missingFields.length >   0) {
            return { error: true, message: `Missing fields: ${missingFields.join(', ')}` };
        }

        return { error: false };
    },
    startup: function(mods) {
        console.log(`%cRotisserie Mod Loader\n%cVersion: ${ml_vars.version}\n%cVersion Date: ${ml_vars.date}`, "font-size:   36px; font-weight: bold; color: lightgreen;", "font-size:   28px; color: lightblue;", "font-size:   24px; color: black;");
        console.log("")
        console.log("%cLoading client mods.", "font-size:  30px; font-weight: bold; color: lightblue;");
        console.log("%cMods that are getting loaded will show below.", "font-size:   14px; color: lightblue;");
        console.log(" ")
        mods.forEach(mod => {
            const verification = this.verifyMod(mod?.info)
            if (verification.error) {
                console.error(`%cAn error occurred with ${mod.info.name ? `the mod "${mod.info?.name}"` : `a mod!`}\nMessage: ${verification.message ? verification.message : 'No error message was provided.'}`, "font-size:   20px; font-weight: bold; color: red;");
            } else {
                if (mod?.startup) mod?.startup() // Blehhhh
                if (!mod.info.custom_message) {
                    mod.started = true // maybe i shouldnt declare this before it logs it in console
                    console.log(`%c${mod.info.name}\n%cVersion:   ${mod.info.version}\n%cDescription: ${mod.info.description}\n%cAuthor: ${mod.info.creator}\n%cHas startup script: ${mod.startup ? 'yes' : 'no'}\n%cChecks for classes: ${mod.info.does_look_for_classes ? 'yes' : 'no'}`, "font-size:   20px; font-weight: bold; color: lightblue;", "font-size:   16px; color: lightgreen;", "font-size:   14px; color: black;", "font-size:   14px; color: lightblue;", "font-size:   14px; color: lightblue;", "font-size:   14px; color: lightblue;");
                } else {
                    if (mod?.startup_message) {
                        mod.startup_message()
                        mod.started = true
                    } else {
                        console.log(`%cError: An error occurred with the mod "${mod.info.name}".\nThere is no 'startup_message' function in the mod object.`, "font-size:   20px; font-weight: bold; color: red;");
                    }
                }
            }
        })
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length >   0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const elements = node.querySelectorAll('*');
                            elements.forEach((element) => {
                                mods.forEach((pair) => {
                                    if (element.classList && element.classList.contains(pair.info.class_to_look_for) && pair.info.does_look_for_classes && pair?.started) {
                                        pair.callback(element);
                                    }
                                });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log(" ")
        console.log("%cLoaded all client mods!", "font-size:  30px; font-weight: bold; color: lightblue;");
    }
}

// maybe i should seperate mods into js files
// DONE!
// will remove client_mods array someday lol
let client_mods = [
    ...ext_mods,
    /* example mod:
    {
        info: {
            name: 'Example mod',
            description: `Test mod`,
            version: `1.0.0`,
            creator: 'yourname',
            class_to_look_for: ``,
            does_look_for_classes: false,
            custom_message: false
        },
        // startup is executed when the page is loaded
        startup: function() {

        },
        // callback is for when a class gets added to the page
        callback: (node) => {

        },
        // startup_message must be declared if custom_message is set to true, will run while the mod is loading mods.
        startup_message: function() {

        }
    },
    */
];
loader_funcs.startup(client_mods); // Yeah
