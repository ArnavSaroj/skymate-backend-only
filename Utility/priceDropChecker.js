import { PriceDropCheck } from '../Controllers/bookmark/bookmark.js'

(async () => {
    try {
        console.log("Reached here");
        await PriceDropCheck();
        console.log("price drop check successfully completed");
    } catch (error) {
        console.error("Price drop check failure", error);
    }
})
    ();