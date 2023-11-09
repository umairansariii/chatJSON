function getCollection(obj) {
    let body = "";
    const arr = obj.match(/>([^]*?)(?=<)/g);
    const date =
        arr[arr.length - 1].slice(1, -2) + " " + arr[arr.length - 1].slice(-2);

    for (let i = 7; i < arr.length - 1; i++) {
        if (arr[i] != ">") {
            body += arr[i].slice(1) + "\n";
        }
    }
    return {
        name: arr[1].slice(1),
        date: new Date(date),
        body: body ? body : "<Media Omitted>",
    };
}
export default function converter(buffer, filename) {
    // (!) Excluding unnecessary css data.
    const splitted = buffer.match(/role="main"[^]*$/g)[0];
    /*
        HTML Structure:
        <div class="_4t5n" role="main">
            <div class="pam ...">
                <div class="...">[name]</div>
                <div class="...">
                    <div>
                        <div></div>
                        <div>[body]</div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div class="...">[time]</div>
            </div>
        </div>
    */
    const array = splitted.match(/<div\sclass="pam[^]*?[ap]m<\/div>/g);
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
