export default function formatInputDate(date) {
    const x = new Date(date);

    // Format the date in "yyyy-MM-ddThh:mm:ss" format
    const formattedDate = `${x.getFullYear()}-${(x.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${x.getDate().toString().padStart(2, "0")}T${x
        .getHours()
        .toString()
        .padStart(2, "0")}:${x.getMinutes().toString().padStart(2, "0")}`;
    return formattedDate;
}
