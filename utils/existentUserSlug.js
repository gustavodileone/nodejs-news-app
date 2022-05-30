const userModel = require("../models/userModel");

module.exports = {
    async existentUserSlug(slug) {
        let existentSlug = await userModel.getUserBySlug(slug);
            
        if(existentSlug != undefined) {
            let i = 1;
        
            while(true) {
                const unusedSlug = `${slug}.${i}`;
        
                existentSlug = await userModel.getUserBySlug(unusedSlug);
                
                if(existentSlug == undefined) {
                    return unusedSlug;
                }
        
                i++;
            }
        }

        return slug;
    }
}