import { getDateFormatted } from './date'

function getAttributeValue(name, data) {
    const string = data.match(`${name}="([^]*?)"`)[1]

    if (name == 'body') {
        return (
            string
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
        )
    } else {
        return string
    }
}
function getCollection(object, id) {
    let name;

    if ( getAttributeValue('type', object) == '2' ) {
        name = 'You'
    } else {
        name = getAttributeValue('address', object)
    }
    return {
        id: id,
        name: name,
        date: getDateFormatted( +getAttributeValue('date', object) ),
        body: getAttributeValue('body', object),
    }
}
export default function converter(buffer, filename) {
    const array = buffer.match(/<sms[^]*?\/>/g)
    const messages = []

    for (let i = 0; i < array.length; i++) {
        messages.push((getCollection(array[i], i)))
    }
    return {
        count: messages.length,
        name: filename,
        messages,
    }
}