import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({
            operation_code: 1
        });
    }
    catch (error: any) {
        return NextResponse.json({
            error: error.message
        });
    }

}
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        if(reqBody){
            const arr = reqBody.data;
            let numbers: number[] = [];
            let alphabets: string[] = [];
            let highest_lowercase_alphabet: string[] = [''];
            
            for (let i of arr) {
                if (typeof i === 'string' && /^[a-zA-Z]$/.test(i)) {
                    alphabets.push(i);
                    if (i === i.toLowerCase() && (highest_lowercase_alphabet[0] === '' || i > highest_lowercase_alphabet[0])) {
                        highest_lowercase_alphabet[0] = i;
                    }
                } else {
                    numbers.push(i);
                }
            }
            

        return NextResponse.json({
            is_success: true,
            user_id: "raghav_chaturvedi_12042003",
            email: "raghavchaturvedi77@gmail.com",
            roll_number:"21BBS0083",
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet:highest_lowercase_alphabet
        });
    }
    else{
        return NextResponse.json({error:"Invalid Request"});
    }

}
    catch (error: any) {
        return NextResponse.json({error:error.message});
}
}