import { getDateFormatted } from './date'

function getCollection(object, id) {
    let body = ''
    const arr = object.match(/>([^]*?)(?=<)/g)
    const date = arr[arr.length-1].slice(1,-2) + ' ' + arr[arr.length-1].slice(-2)

    for (let i = 7; i < arr.length-1; i++ ) {
        if (arr[i] != '>') {
            body += arr[i].slice(1) + '\n'
        }
    }
    return {
        id: id,
        name: arr[1].slice(1),
        date: getDateFormatted(date),
        body: body? body: '<Media Omitted>',
    }
}
export default function converter(buffer, filename) {
    const splitted = buffer.match(/role="main"[^]*$/g)[0]
    const array = splitted.match(/<div\sclass="pam[^]*?[ap]m<\/div>/g)
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