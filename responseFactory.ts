import { sprintf } from "sprintf-js";

export class ResponseFactory
{
    private static readonly HELP_STRING = 
        sprintf(
            "%(projectDisplayName)s (%(projectName)s)\n" +
            "Bu botu kullanarak şu adreste (%(sourceArticleUrl)s) yer alan makalede bahsedilmekte olan" +
            "ve Türkçe yer ismi üreten yapay zeka modelini çağırabilir ve alternatif yer ismi üretebilirsiniz." + 
            "Ayrıca, geliştirilmiş olan Türkçe atasözü üreten yapay zeka modelini çağırarak yapay atasözü de" + 
            "ürettirebilirsiniz; lakin bu model henüz anlaşılır atasözleri üretebilecek kadar olgunlaşmamıştır.\n" + 
            "Kullanılabilecek komutlar: " + 
            "'%(helpCommand)s' - bu yardım metnini görmenizi sağlar\n" + 
            "'%(placeNameCommand)s' - bir yer ismi üretir" + 
            "'%(proverbCommand)s' - bir atasözü üretir");

    public static createResponse(request: string): string
    {
        
    }
}