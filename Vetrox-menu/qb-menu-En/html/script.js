let buttonParams = [];
let Button = [];
let MenuHeaderCounter = 0;

function isValidHttpUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

const openMenu = (data = null) => {
    let html = "";
    $(".TextTitle").html("");
    data.forEach((item, index) => {
        if (!item.hidden) {
            let header = item.header;
            let message = item.txt || item.text;
            let isMenuHeader = item.isMenuHeader;
            let isDisabled = item.disabled;
            let icon = item.icon;
            let progressbar = item.ProgressBar;
            let image = item.image;
            if (isMenuHeader) {
                getMenuHeaderRender(header, index);
                return;
            }
            html += getButtonRender(header, message, index, isMenuHeader, isDisabled, icon, progressbar);

            if (item.params) buttonParams[index] = item.params;
            if (item.image) Button[index] = { index, image };
        }
    });
    $("#buttons").html(html);
    $('.background').fadeIn();;
    $('.VetroxInformations').fadeIn();;
    $('.Exit').fadeIn();;
    document.getElementById('Logo').src = "./logo.png";
    $('.button').click(function () {
        const target = $(this);
        if (!target.hasClass('title') && !target.hasClass('disabled')) {
            postData(target.attr('id'));
        }
    });
};


const getMenuHeaderRender = (header, id) => {
    $(".TextTitle").html(header);
};


const getButtonRender = (header = null, message = null, id, isMenuHeader, isDisabled, icon, progressbar) => {
    if (icon !== undefined) {
        return `
        <div class="${isMenuHeader ? "button" : "button"} ${isDisabled ? "disabled" : ""}" id="${id}">
            <div class="icon">
                <img src=${icon} width=30px onerror="this.onerror=null; this.remove();">
                <i class="${icon}" onerror="this.onerror=null; this.remove();"></i>
            </div>
            <div class="column">
                <div class="header">${header}</div>
            ${message ? `<div class="text">${message}</div>` : ""}
                ${progressbar ? `<div class='progressbar'>
                    <div class='progressbar-bar' style='width: ${progressbar.Value / progressbar.MaxValue * 100}%;'></div>
                </div> 
                <div class='progressbar-info'>${progressbar.Value}/${progressbar.MaxValue}</div>` : ""}
            </div>
        </div>
    `;
    } else {
        return `
        <div class="${isMenuHeader ? "button" : "button"} ${isDisabled ? "disabled" : ""}" id="${id}">
            <div class="icon">
                <img src=${icon} width=30px onerror="this.onerror=null; this.remove();">
                <i class="${icon}" onerror="this.onerror=null; this.remove();"></i>
            </div>
            <div class="column">
                <div class="header">${header}</div>
                ${progressbar ? `<div class='progressbar'>
                    <div class='progressbar-bar' style='width: ${progressbar.Value / progressbar.MaxValue * 100}%;'></div>
                </div> 
                <div class='progressbar-info'>${progressbar.Value}/${progressbar.MaxValue}</div>` : ""}
            </div>
        </div>
    `;
    }
};

const closeMenu = () => {
    $("#buttons").html(" ");
    $('.background').css('display', "none");
    $('.VetroxInformations').css('display', "none");
    $('.Exit').css('display', "none");
    $('#imageHover').css('display', "none");
    buttonParams = [];
    Button = [];
};

const postData = (id) => {
    $.post(`https://${GetParentResourceName()}/clickedButton`, JSON.stringify(parseInt(id) + 1));
    return closeMenu();
};

const cancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    return closeMenu();
};

window.addEventListener("message", (event) => {
    const data = event.data;
    const buttons = data.data;
    const action = data.action;
    switch (action) {
        case "OPEN_MENU":
        case "SHOW_HEADER":
            return openMenu(buttons);
        case "CLOSE_MENU":
            return closeMenu();
        default:
            return;
    }
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        cancelMenu();
    }
};

window.addEventListener('mousemove', (event) => {
    let $target = $(event.target);
    if ($target.closest('.button:hover').length && $('.button').is(":visible")) {
        let id = event.target.id;
        if (!Button[id]) return;
        if (Button[id].image) {
            document.getElementById('image').src = Button[id].image;
            $('#imageHover').fadeIn();;
        }
    } else {
        $('#imageHover').css('display', "none");
    }
});