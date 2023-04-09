import convertSMS from './functions/sms';
import convertWhatsApp from './functions/whatsapp';
import convertMessenger from './functions/messenger';

export default function loader(file, cb, id) {
    const reader = new FileReader();
    reader.readAsText(file);
    
    reader.onload = () => {
        if (file.type == 'text/plain') {
            cb(convertWhatsApp(reader.result, file.name), id);
        };
        if (file.type == 'text/html') {
            cb(convertMessenger(reader.result, file.name), id);
        };
        if (file.type == 'text/xml') {
            cb(convertSMS(reader.result, file.name), id);
        };
    };
};