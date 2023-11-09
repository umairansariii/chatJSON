function getAttributeValue(key, obj) {
    const string = obj.match(`${key}="([^]*?)"`)[1];

    if (key == "body") {
        return string
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
    } else {
        return string;
    }
}
function getCollection(obj) {
    let name;

    if (getAttributeValue("type", obj) == "2") {
        name = "You";
    } else {
        name = getAttributeValue("address", obj);
    }
    return {
        name: name,
        date: new Date(getAttributeValue("time", obj)),
        body: getAttributeValue("body", obj),
    };
}
export default function converter(buffer, filename) {
    /*
        XML Structure:
        <sms
            address="xxx"
            time="xxx"
            type="<1|2>"
            body="..."
        />
    */
    const array = buffer.match(/<sms[^]*?\/>/g);
    const messages = [];

    // Collects all dataset from each message.
    for (let i = 0; i < array.length; i++) {
        messages.push(getCollection(array[i]));
    }
    // Sort by datetime and append id.
    messages.sort((a, b) => a.date.getTime() - b.date.getTime());
    messages.map((e, idx) => (e.id = idx));

    return {
        count: messages.length,
        name: filename,
        messages,
    };
}
