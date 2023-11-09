export default function formatWhatsAppDate(date) {
    const pattern =
        /\[?(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):?(\d+)?\s?([ap]m)?\]?/i;
    const arr = date.match(pattern);

    if (arr[7] == "pm") {
        arr[4] = Number(arr[4]) + 12;
    }
    return new Date(
        arr[3],
        arr[2] - 1,
        arr[1],
        arr[4],
        arr[5],
        arr[6] ? arr[6] : 0
    );
}
