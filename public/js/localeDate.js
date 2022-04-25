function convertToLocaleDate(element) {
    let date = element.innerText;
    date = date.split(" ");
    date[0] = date[0].split("-");
    date[1] = date[1].split(":");

    // Year, month, day, hour, minute and seconds
    const dateObj = new Date(Date.UTC(date[0][0], date[0][1], date[0][2], date[1][0], date[1][1], date[1][2]));
    element.innerText = dateObj.toLocaleDateString();
    element.innerText += " " + dateObj.toLocaleTimeString();
}

const element = [... document.getElementsByClassName("date")];

if(element !== null) {
    element.forEach(elementItem => {
        convertToLocaleDate(elementItem);
    })
}