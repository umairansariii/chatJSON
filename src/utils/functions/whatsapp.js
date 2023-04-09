import { getDateWhatsApp } from "./date"

function getCollection(object, id) {
    const arr = object.match(/(\[?\d+\/\d+\/\d+,\s\d+:\d+(?::\d+)?(?:\s[ap]m)?\]?)\s-?(?:\s?(.+):)?\s([^]*)/)
    return {
        id: id,
        name: arr[2]? arr[2]: 'System',
        date: getDateWhatsApp(arr[1]),
        body: arr[3],
    }
}
export default function converter(buffer, filename) {
    buffer += '\n00/00/0000, 00:00:00'

    const array = buffer.match(/\[?\d+\/\d+\/\d+,\s\d+:\d+(?::\d+)?(?:\s[ap]m)?\]?[^]*?(?=\[?\d+\/\d+\/\d+,\s\d+:\d+(?::\d+)?(?:\s[ap]m)?\]?)/g)
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