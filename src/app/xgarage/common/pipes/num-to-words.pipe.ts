import { Pipe, PipeTransform } from '@angular/core';

const numbersToWords = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
};

@Pipe({
    name: 'numToWords'
})
export class NumToWordsPipe implements PipeTransform {

    transform(value: number): unknown {
        // if number present in object no need to go further
        if (value in numbersToWords) return numbersToWords[value];

        // Initialize the words variable to an empty string
        let words = "";

        // If the number is greater than or equal to 100, handle the hundreds place (ie, get the number of hundres)
        if (value >= 100) {
            // Add the word form of the number of hundreds to the words string
            words += this.transform(Math.floor(value / 100)) + " hundred";

            // Remove the hundreds place from the number
            value %= 100;
        }

        // If the number is greater than zero, handle the remaining digits
        if (value > 0) {
            // If the words string is not empty, add "and"
            if (words !== "") words += " and ";

            // If the number is less than 20, look up the word form in the numbersToWords object
            if (value < 20) words += numbersToWords[value];
            else {
                // Otherwise, add the word form of the tens place to the words string
                //if number = 37, Math.floor(number /10) will give you 3 and 3 * 10 will give you 30
                words += numbersToWords[Math.floor(value / 10) * 10];

                // If the ones place is not zero, add the word form of the ones place
                if (value % 10 > 0) {
                    words += "-" + numbersToWords[value % 10];
                }
            }
        }

        // Return the word form of the number
        return words + ' Omani Rial';
    }

}
