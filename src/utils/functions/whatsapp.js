import formatWhatsAppDate from "../formatWhatsappDate";

function getCollection(obj) {
    const arr = obj.match(
        /(\[?\d+\/\d+\/\d+,\s\d+:\d+(?::\d+)?(?:\s[ap]m)?\]?)\s-?(?:\s?(.+):)?\s([^]*)/
    );
    return {
        name: arr[2] ? arr[2] : "System",
        date: formatWhatsAppDate(arr[1]),
        body: arr[3],
    };
}
export default function converter(buffer, filename) {
    // (!) Appending this to include last message.
    buffer += "\n00/00/0000, 00:00:00";
    /*
        TXT Structure:
        dd/mm/yyyy, hh:mm pm|am - xxx: ...
    */
    const array = buffer.match(
        /\[?\d+\/\d+\/\d+,\s\d+:\d+(?::\d+)?(?:\s[ap]m)?\]?[^]*?(?=\[?\d+\/\d+\/\d+,\s\d+:\d+(?::\d+)?(?:\s[ap]m)?\]?)/g
    );
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
