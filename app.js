/*Imports */
const htmlTags = require('html-tags');
const voidHtmlTags = require('html-tags/void');
const fs = require("fs");

/*variable data holds the value of the .csv file in a single string*/
const data = fs.readFileSync('content_snippets-20220728-csv.csv').toString();

/**
 * Removes duplicates from an array of strings
 * @param {string[]} tags Array containing the already validated tags from
 * @returns Returns a filtered array of unique tags
 */
const removeDuplicateTags = (tags)=>{
    return tags.filter( (tag, index)=> tags.indexOf(tag) === index );
}

/**
 * Validates the tags by comparing them to a pool of valid HTML tags and then returning just the tags that match
 * @param {string[]} tags Array containing the tags found spread all over the .csv file
 * @returns An array with the tags that matched with the ones from the pool of valid HTML tags
 */
const validateTags = (tags) => {

    if(tags.length === 0) return;

    let validatedTags = [];
    tags.map( tag => {
        let tempTagArr = [];
        let tempTagStr = "";
        
        if( tag.startsWith("</") || tag.match(/\n/g) ) return;

        if( tag.endsWith("/>")){
            tempTagArr = tag.split("");
            tempTagArr.pop();
            tempTagArr.pop();
            tempTagArr.shift();
            tempTagStr = tempTagArr.join("").trim();
            
            if( voidHtmlTags.includes(tempTagStr) ){
                validatedTags.push( tag );
            }
        } else {
            tempTagArr = tag.split("");
            tempTagArr.pop();
            tempTagArr.shift();
            tempTagStr = tempTagArr.join("").trim();
            
            if( htmlTags.includes(tempTagStr) ){
                validatedTags.push( tag );
            }
        }
    });
    return validatedTags;
 }

/**
 * Maps the .csv file to find the cluttered tags by matching them one by one with a regex and creates an array of tags. These tags will then be validated and reduced so it only prints unique tags
 * @param {string} str variable holding the value of the .csv file parsed into a string
 * @returns The unique HTML tags found spread all over the .csv file
 */ 
const mapFile = (str)=> {
    const foundTags = str.match(/<(“[^”]*”|'[^’]*’|[^'”>])*>/g);
    let tags = validateTags( foundTags );

    return removeDuplicateTags( tags );
}

/*Prints the HTML tags*/
console.log( mapFile( data ) );
