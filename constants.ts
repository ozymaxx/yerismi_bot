import { sprintf } from "sprintf-js";

export class Constants
{
    private static readonly COMMAND_TEMPLATE = "bana %s üret";
    private static readonly COMMAND_TEMPLATE_WITHOUT_TURKISH_CHARS = "bana%suret";

    public static readonly PROJECT_DISPLAY_NAME = "Sinir Ağları Tabanlı Türkçe Yer İsmi Botu";
    public static readonly PROJECT_NAME = "yerismi_bot";
    public static readonly AUTHOR_NAME = "Ozan Can Altıok";
    public static readonly PROVERB_COMMAND = sprintf(Constants.COMMAND_TEMPLATE, "atasözü");
    public static readonly PROVERB_COMMAND_WITHOUT_TURKISH_CHARS = 
        sprintf(Constants.COMMAND_TEMPLATE_WITHOUT_TURKISH_CHARS, "atasozu");
    public static readonly PLACE_NAME_COMMAND = sprintf(Constants.COMMAND_TEMPLATE, "yer ismi");
    public static readonly PLACE_NAME_COMMAND_WITHOUT_TURKISH_CHARS = 
        sprintf(Constants.COMMAND_TEMPLATE_WITHOUT_TURKISH_CHARS, "yerismi");
    public static readonly PERSON_NAME_COMMAND = sprintf(Constants.COMMAND_TEMPLATE, "kişi ismi");
    public static readonly PERSON_NAME_COMMAND_WITHOUT_TURKISH_CHARS = 
        sprintf(Constants.COMMAND_TEMPLATE_WITHOUT_TURKISH_CHARS, "kisiismi");
    public static readonly HELP_COMMAND = "yardım lütfen";
    public static readonly HELP_COMMAND_WITHOUT_TURKISH_CHARS = "yardimlutfen";
    public static readonly SOURCE_ARTICLE_URL = "https://ozymaxx.github.io/blog/2017/08/17/sahte-atasoz-yerismi/";
    public static readonly WELCOME_MESSAGE = 
        sprintf(
            "Selam! Bana '%(proverbCommand)s', '%(personNameCommand)s' veya '%(placeNameCommand)s' yazarsan, sana sahte " + 
            "atasözü, kişi ismi veya yer ismi üretebilirim!", 
            {
                proverbCommand: Constants.PROVERB_COMMAND,
                placeNameCommand: Constants.PLACE_NAME_COMMAND,
                personNameCommand: Constants.PERSON_NAME_COMMAND
            });
}