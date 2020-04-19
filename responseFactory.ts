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
            "'%(personNameCommand)s' - bir kişi ismi üretir\n" + 
            "'%(proverbCommand)s' - bir atasözü üretir\n", 
            {
                projectDisplayName: Constants.PROJECT_DISPLAY_NAME,
                projectName: Constants.PROJECT_NAME,
                sourceArticleUrl: Constants.SOURCE_ARTICLE_URL,
                helpCommand: Constants.HELP_COMMAND,
                placeNameCommand: Constants.PLACE_NAME_COMMAND,
                proverbCommand: Constants.PROVERB_COMMAND,
                personNameCommand: Constants.PERSON_NAME_COMMAND
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
    private static readonly TURKISH_CHARS = new Set<string>(["Ç", "Ğ", "Ö", "İ", "Ş", "Ü", "ç", "ğ", "ı", "ş", "ö", "ü"]);
    private static readonly TURKISH_CHAR_2_LATIN_CHAR = new Map<string, string>([
        ["Ç", "C"],
        ["Ğ", "G"],
        ["Ö", "O"],
        ["İ", "i"],
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
    private static readonly PERSON_NAME_MODEL_FILE_PATH = "language_models/checkpoint_11600.t7";
    private static readonly PLACENAME_CHAR_LENGTH = 100;
    private static readonly PROVERB_CHAR_LENGTH = 1000;
    private static readonly PERSON_NAME_CHAR_LENGTH = 100;
    private static readonly COMMAND_TEMPLATE = "./torch/install/bin/th sample.lua -checkpoint %(modelFilePath)s -length %(charLength)d -gpu -1";
    private static readonly INVALID_COMMAND_RESPONSE = 
        sprintf(
            "Ne istediğini anlamadım; '%(helpCommand)s' yazarak yardım isteyebilirsin.", 
            { helpCommand: Constants.HELP_COMMAND });
    private static readonly MAX_LEVENSHTEIN_DISTANCE = 4;

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

    private static readonly FAKE_RESPONSE_CREATION_FUNCTIONS = [
        () => ResponseFactory.HELP_STRING, 
        () => ResponseFactory.createFakeResponse(
            ResponseFactory.PROVERB_CHAR_LENGTH, ResponseFactory.PROVERB_MODEL_FILE_PATH),
        () => ResponseFactory.createFakeResponse(
            ResponseFactory.PLACENAME_CHAR_LENGTH, ResponseFactory.PLACENAME_MODEL_FILE_PATH),
        () => ResponseFactory.createFakeResponse(
            ResponseFactory.PERSON_NAME_CHAR_LENGTH, ResponseFactory.PERSON_NAME_MODEL_FILE_PATH)];
    private static readonly COMMANDS_WITHOUT_TURKISH_CHARS = [
        Constants.HELP_COMMAND_WITHOUT_TURKISH_CHARS,
        Constants.PROVERB_COMMAND_WITHOUT_TURKISH_CHARS,
        Constants.PLACE_NAME_COMMAND_WITHOUT_TURKISH_CHARS,
        Constants.PERSON_NAME_COMMAND_WITHOUT_TURKISH_CHARS];

    public static levenshteinDistance(request: string, actualCommand: string): number
    {
        const requestLength = request.length;
        const actualCommandLength = actualCommand.length;
        if (requestLength === 0)
        {
            return actualCommandLength;
        }
        if (actualCommandLength === 0)
        {
            return requestLength;
        }
        const table: number[][] = [];
        for (let i = 0; i < requestLength; ++i)
        {
            const row: number[] = [];
            for (let j = 0; j < actualCommandLength; ++j)
            {
                row.push(0);
            }
            table.push(row);
        }
        if (request.charAt(0) !== actualCommand.charAt(0))
        {
            table[0][0] = 1;
        }
        for (let i = 0; i < requestLength; ++i)
        {
            for (let j = 0; j < actualCommandLength; ++j)
            {
                if (!i && !j)
                {
                    continue;
                }
                let value = 0;
                if (Math.min(i, j) === 0)
                {
                    value = Math.max(i, j);
                }
                else
                {
                    let leftDiagonalValue = table[i-1][j-1];
                    if (request.charAt(i) !== actualCommand.charAt(j))
                    {
                        ++leftDiagonalValue;
                    }
                    const upperValue = table[i-1][j] + 1;
                    const leftValue = table[i][j-1] + 1;
                    value = Math.min(leftDiagonalValue, upperValue, leftValue);
                }
                table[i][j] = value;
            }
        }
        return table[requestLength-1][actualCommandLength-1];
    }

    public static createResponse(request: string): string
    {
        const cleanRequest = ResponseFactory.eliminateTurkishCharsAndConvertToLowercase(request);
        const levenshteinDistancesOfAllCommands = 
            ResponseFactory.COMMANDS_WITHOUT_TURKISH_CHARS.map(
                (command: string) => ResponseFactory.levenshteinDistance(cleanRequest, command));
        const minLevenshteinDistance = Math.min(...levenshteinDistancesOfAllCommands);
        if (minLevenshteinDistance <= ResponseFactory.MAX_LEVENSHTEIN_DISTANCE)
        {
            const properFakeResponseCreationFunctionIndex = 
                levenshteinDistancesOfAllCommands.indexOf(minLevenshteinDistance);
            return ResponseFactory.FAKE_RESPONSE_CREATION_FUNCTIONS[properFakeResponseCreationFunctionIndex]();
        }
        return ResponseFactory.INVALID_COMMAND_RESPONSE;
    }
}
