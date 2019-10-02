import { sprintf } from "sprintf-js";
import { Constants } from "./constants";
import { exec } from "shelljs";

export class ResponseFactory
{
    public static readonly HELP_STRING = 
        sprintf(
            "%(projectDisplayName)s (%(projectName)s)\n" +
            "Bu botu kullanarak şu adreste (%(sourceArticleUrl)s) yer alan makalede bahsedilmekte olan " +
            "ve Türkçe yer ismi üreten yapay zeka modelini çağırabilir ve alternatif yer ismi üretebilirsiniz. " + 
            "Ayrıca, geliştirilmiş olan Türkçe atasözü üreten yapay zeka modelini çağırarak yapay atasözü de " + 
            "ürettirebilirsiniz; lakin bu model henüz anlaşılır atasözleri üretebilecek kadar olgunlaşmamıştır.\n" + 
            "Kullanılabilecek komutlar: " + 
            "'%(helpCommand)s' - bu yardım metnini görmenizi sağlar\n" + 
            "'%(placeNameCommand)s' - bir yer ismi üretir\n" + 
            "'%(proverbCommand)s' - bir atasözü üretir\n", 
            {
                projectDisplayName: Constants.PROJECT_DISPLAY_NAME,
                projectName: Constants.PROJECT_NAME,
                sourceArticleUrl: Constants.SOURCE_ARTICLE_URL,
                helpCommand: Constants.HELP_COMMAND,
                placeNameCommand: Constants.PLACE_NAME_COMMAND,
                proverbCommand: Constants.PROVERB_COMMAND
            });
    private static readonly ACCEPTABLE_CHARS = new Set<string>([
        "A", 
        "B", 
        "C",
        "Ç", 
        "D", 
        "E", 
        "F", 
        "G", 
        "Ğ", 
        "H", 
        "I",
        "İ", 
        "J", 
        "K",
        "L", 
        "M", 
        "N", 
        "O", 
        "Ö", 
        "P", 
        "R", 
        "S", 
        "Ş", 
        "T", 
        "U", 
        "Ü", 
        "V", 
        "Y", 
        "Z",
        "Q", 
        "W",
        "a",
        "b", 
        "c", 
        "ç", 
        "d", 
        "e", 
        "f", 
        "g", 
        "ğ", 
        "h", 
        "ı", 
        "i",
        "j", 
        "k", 
        "l", 
        "m", 
        "n", 
        "o", 
        "ö", 
        "p", 
        "r", 
        "s", 
        "ş", 
        "t", 
        "u", 
        "ü", 
        "v", 
        "y", 
        "z", 
        "q", 
        "w"
    ]);
    private static readonly TURKISH_CHARS = new Set<string>(["Ç", "Ğ", "Ö", "Ş", "Ü", "ç", "ğ", "ı", "ş", "ö", "ü"]);
    private static readonly TURKISH_CHAR_2_LATIN_CHAR = new Map<string, string>([
        ["Ç", "C"],
        ["Ğ", "G"],
        ["Ö", "O"],
        ["Ş", "S"],
        ["Ü", "U"],
        ["ç", "c"],
        ["ğ", "g"],
        ["ı", "i"],
        ["ö", "o"],
        ["ş", "s"],
        ["ü", "u"]
    ]);
    private static readonly PLACENAME_MODEL_FILE_PATH = "language_models/checkpoint_7600.t7";
    private static readonly PROVERB_MODEL_FILE_PATH = "language_models/checkpoint_1600.t7";
    private static readonly PLACENAME_CHAR_LENGTH = 100;
    private static readonly PROVERB_CHAR_LENGTH = 1000;
    private static readonly COMMAND_TEMPLATE = "th sample.lua -checkpoint %(modelFilePath)s -length %(charLength)d -gpu -1";
    private static readonly INVALID_COMMAND_RESPONSE = 
        sprintf(
            "Ne istediğini anlamadım; '%(helpCommand)s' yazarak yardım isteyebilirsin.", 
            { helpCommand: Constants.HELP_COMMAND });

    private static eliminateTurkishCharsAndConvertToLowercase(command: string): string
    {
        command = command.trim();
        const newChars: string[] = [];
        for (let i = 0; i < command.length; ++i)
        {
            let newChar = command.charAt(i);
            if (!ResponseFactory.ACCEPTABLE_CHARS.has(newChar))
            {
                continue;
            }
            if (ResponseFactory.TURKISH_CHARS.has(newChar))
            {
                newChar = ResponseFactory.TURKISH_CHAR_2_LATIN_CHAR.get(newChar);
            }
            newChars.push(newChar.toLowerCase());
        }
        return newChars.join("");
    }

    private static createFakeResponse(charLength: number, modelFilePath: string): string
    {
        const outputWithMultipleLines = 
            exec(sprintf(ResponseFactory.COMMAND_TEMPLATE, { charLength, modelFilePath })).stdout.trim();
        const splitOutput = outputWithMultipleLines.split("\n");
        return splitOutput[2];
    }

    public static createResponse(request: string): string
    {
        console.log(ResponseFactory.eliminateTurkishCharsAndConvertToLowercase(request));
        switch (ResponseFactory.eliminateTurkishCharsAndConvertToLowercase(request))
        {
            case Constants.HELP_COMMAND_WITHOUT_TURKISH_CHARS:
                return ResponseFactory.HELP_STRING;
            case Constants.PROVERB_COMMAND_WITHOUT_TURKISH_CHARS:
                return ResponseFactory.createFakeResponse(
                    ResponseFactory.PROVERB_CHAR_LENGTH, ResponseFactory.PROVERB_MODEL_FILE_PATH);
            case Constants.PLACE_NAME_COMMAND_WITHOUT_TURKISH_CHARS:
                return ResponseFactory.createFakeResponse(
                    ResponseFactory.PLACENAME_CHAR_LENGTH, ResponseFactory.PLACENAME_MODEL_FILE_PATH);
            default:
                return ResponseFactory.INVALID_COMMAND_RESPONSE;
        }
    }
}