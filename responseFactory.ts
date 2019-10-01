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
    private static readonly INVALID_COMMAND_RESPONSE = 
        sprintf(
            "Ne istediğini anlamadım; '%(helpCommand)s' yazarak yardım isteyebilirsin.", 
            { helpCommand: Constants.HELP_COMMAND });

    public static createResponse(request: string): string
    {
        switch (request)
        {
            case Constants.HELP_COMMAND:
                return ResponseFactory.HELP_STRING;
            case Constants.PROVERB_COMMAND:
                return exec("echo 'ozan'").stdout;
            case Constants.PLACE_NAME_COMMAND:
                return exec("th ../sample.lua -checkpoint cv/checkpoint_7600.t7 -length 100 -gpu -1").stdout;
            default:
                return ResponseFactory.INVALID_COMMAND_RESPONSE;
        }
    }
}