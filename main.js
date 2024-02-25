/*
    shitty mod loader
*/

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
        console.log("%cRotisserie Mod Loader\n%cVersion: 0.0.1\n%cLast Updated: 24 Feb 2024", "font-size:   36px; font-weight: bold; color: lightgreen;", "font-size:   28px; color: lightblue;", "font-size:   24px; color: black;");
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


let client_mods = [
    {
        info: {
            name: 'February 2017 Client Button Mod',
            description: `Test mod, to see if i can do stuff.`,
            version: `1.0.0`,
            creator: 'natsu',
            class_to_look_for: `userSettingsSecurity-1hjwAn`,
            does_look_for_classes: true,
            custom_message: false // you can add a function to the object called "startup_message" to add a custom message, will break the entire script if not in the object
        },
        // add startup function for a function to execute on startup lol lol
        callback: (node) => {
            console.log('Element with class userSettingsSecurity-1hjwAn added');
            const mainSettings = node.parentElement
            const newDiv = document.createElement('div');
            newDiv.classList.add('marginTop60-10QB5x')
            newDiv.innerHTML = `
            <h2 class="h2-2ar_1B title-1pmpPr size16-3IvaX_ height20-165WbF weightSemiBold-T8sxWH defaultColor-v22dK1 defaultMarginh2-37e5HZ marginBottom20-2Ifj-2">
                February 2017 Client
            </h2>
            <div class="flex-vertical">
                <div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;">
                    <div class="flexChild-1KGW5q" style="flex: 1 1 auto;">
                        <div>
                            <div class="description-3MVziF formText-1L-zZB marginBottom20-2Ifj-2 modeDefault-389VjU primary-2giqSn">
                                Want to switch to February 2017 client? Click the button below! 
                                Beware, this will be buggy and might not show everything for March 2018.\n\nThis currently does not work.
                            </div>
                        <div>
                        <button type="button" class="button-2t3of8 lookFilled-luDKDo colorBrand-3PmwCE sizeSmall-3g6RX8 grow-25YQ8u disabled-uc2Cqc">
                            <div class="contents-4L4hQM">
                                Go to February 2017
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div></div>`
            mainSettings.appendChild(newDiv);
        }
    },
    {
        info: {
            name: 'Green Text & Orange Text',
            description: `Mod that converts messages starting with > into greentext and messages ending with < into orange text. Just like 4Chan!`,
            version: `1.0.0`,
            creator: 'natsu',
            class_to_look_for: `message-text`,
            does_look_for_classes: true,
            custom_message: false
        },
        startup: function() {
            let chatElements = document.querySelectorAll('.message-text');
            chatElements.forEach(function(element) {
                if (element.querySelector('.markup') && !element?.getAttribute('handled.greentext')) {
                    const text = element.querySelector('.markup')
                    var lines = text.innerHTML.toString().split("\n")
                    let changedStuff = false

                    let thisLiney = []
                    lines.forEach(function(line) {
                        if (line.trim().startsWith('&gt;') && !line.trim().endsWith('&lt;')) {
                            thisLiney.push('<span style="color: #789922;">' + line + '</span>');
                            changedStuff = true
                        } else if (line.trim().endsWith('&lt;') && !line.trim().startsWith('&gt;')) {
                            thisLiney.push('<span style="color: #FF7F00;">' + line + '</span>');
                            changedStuff = true
                        } else {
                            thisLiney.push(line)
                        }
                    });
                    if (changedStuff) text.innerHTML = thisLiney.join("<br>")
                    element.setAttribute('handled.greentext', true);
                }
            });
        },
        callback: (node) => {
            let chatElements = [node];
            chatElements.forEach(function(element) {
                if (element.querySelector('.markup') && !element?.getAttribute('handled.greentext')) {
                    const text = element.querySelector('.markup')
                    var lines = text.innerHTML.toString().split("\n")
                    let changedStuff = false

                    let thisLiney = []
                    lines.forEach(function(line) {
                        if (line.trim().startsWith('&gt;') && !line.trim().endsWith('&lt;')) {
                            thisLiney.push('<span style="color: #789922;">' + line + '</span>');
                            changedStuff = true
                        } else if (line.trim().endsWith('&lt;') && !line.trim().startsWith('&gt;')) {
                            thisLiney.push('<span style="color: #FF7F00;">' + line + '</span>');
                            changedStuff = true
                        } else {
                            thisLiney.push(line)
                        }
                    });
                    if (changedStuff) text.innerHTML = thisLiney.join("<br>")
                    element.setAttribute('handled.greentext', true);
                }
            });
        }
    },
    {
        info: {
            name: 'GMedia Rotisserie Port (LEGACY)',
            description: `GMedia is a mod that fixes non embedding videos and audio.`,
            version: `1.0.0`,
            creator: 'natsu',
            class_to_look_for: `message`,
            does_look_for_classes: true,
            custom_message: false
        },
        startup: function() {
            
        },
        callback: (node) => {

        }
    },
    
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
