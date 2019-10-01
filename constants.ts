import { sprintf } from "sprintf-js";

export class Constants
{
    private static readonly COMMAND_TEMPLATE = "bana %s üret";

    public static readonly PROJECT_DISPLAY_NAME = "Sinir Ağları Tabanlı Türkçe Yer İsmi Botu";
    public static readonly PROJECT_NAME = "yerismi_bot";
    public static readonly AUTHOR_NAME = "Ozan Can Altıok";
    public static readonly PROVERB_COMMAND = sprintf(Constants.COMMAND_TEMPLATE, "atasözü");
    public static readonly PLACE_NAME_COMMAND = sprintf(Constants.COMMAND_TEMPLATE, "yer ismi");
    public static readonly HELP_COMMAND = "yardım lütfen";
    public static readonly SOURCE_ARTICLE_URL = "https://ozymaxx.github.io/blog/2017/08/17/sahte-atasoz-yerismi/";
}