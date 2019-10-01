# Sinir Ağları Tabanlı Yer İsimleri Üreten Telegram Botu
[Bu yazımda](https://ozymaxx.github.io/blog/2017/08/17/sahte-atasoz-yerismi/) yer alan sahte atasözü 
ve yer ismi üretme modelinin çalıştığı basit bir Telegram botu hazırladım. Bot, aşağıdaki komutları 
desteklemektedir:

* `yardım lütfen`: Botun içeriği ve kullanımı hakkında mesaj almanızı sağlar. 
* `bana atasözü üret`: Botun sahte atasözü üretmesini sağlar.
* `bana yer ismi üret`: Botun sahte yer ismi üretmesini sağlar.

## Kaynak kodun içeriği
But bot sunucusu, yukarıda bağlantısı paylaşılmış olan yazıdan yola çıkılarak üretilebilecek sahte
atasözü ve yer ismi üretebilen dil modellerini kullanmaktadır. Oluşturulan yığın dosyaları, kullanıcının
Telegram üzerinden istediği içeriğin türüne (sahte atasözü veya yer ismi) karar verilmesini ve istenilen
türde içeriğin oluşturulması için uygun dil modelinin çağrılmasını sağlamaktadır.

## Nasıl kullanılır?
* Yukarıdaki yazımda yer alan docker imajını, yazıda belirtildiği gibi açıyoruz. İlerleyen adımlarda belirtildiği
şekilde dil modellerimizi eğitiyoruz.

* [BotFather](https://t.me/botfather) kanalını kullanarak bir Telegram botu oluşturuyoruz.
`/newbot` komutu ile bir bot oluşturacağımızı belirtiyoruz. Bot yaratıcımız da bizden botumuza bir isim vermemizi
istiyor. Ardından botumuza bir kullanıcı ismi vermemiz isteniyor. Bu işlemlerin ardından botumuzun adresi ve 
bot üzerinde geliştirme yapabilmemiz için bir HTTP API anahtarı sağlanıyor. Bu anahtarı bir yere kaydediyoruz
ve başkalarıyla paylaşmıyoruz.

* Açmış olduğumuz Docker imajı içerisinde `~/torch-rnn` dizinindeyken `git clone https://github.com/ozymaxx/yerismi_bot.git` komutu ile bu alanda yer alan kaynak kodu indiriyoruz. 

* Şu [yazıda](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/) de görülebileceği üzere, aşağıdaki komutları
uygulayarak Docker imajına uygun NPM ve Node.js paketlerinin kurulmasını sağlıyoruz:
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get install nodejs
```

* `cd yerismi_bot` komutu ile kaynak kodumuzun yer aldığı klasöre gidiyoruz ve aşağıdaki komut dizelerini kullanarak
yazılmış olan TypeScript kodunu JavaScript'e çeviriyoruz:
```
npm install
npm run-script build
```

* Çevrilen JavaScript kodlarını ve bu kodların çalışması için gerekli paketleri, aşağıdaki komutları kullanarak bir üst
dizine, yani dil modellerinin ve sahte atasözü/yer ismi üreten yığın dosyalarının yer aldığı dizine kopyalıyoruz:
```
cp -a node_modules/. ..
cp *.js ..
```

* Telegram botunun oluşturulması esnasında sahip olduğumuz anahtarı, bir ortam değişkeni olarak depoluyoruz. Söz konusu
değişken, oluşturulan JS scriptleri tarafından kullanılmaktadır. Aşağıdaki komutu Docker imajımızın konsolu üzerinde çalıştırıyoruz:
```
export BOT_TOKEN="<anathar>" 
```
Bu komutta `<anahtar>` yerine elimizde bulunan anahtarı yazıyoruz.

* Son olarak, `node index.js` komutu ile bot sunucumuzu ayağa kaldırıyoruz. Artık botumuzu gönül rahatlığıyla kullanabiliriz!

## Dizaynı geliştirmek
Kullanım popularitesinden ötürü sohbet botunu TS kullanarak Node.js üzerinde gerçekledim. Node.js üzerinde çalışan bot sunucusu, Lua üzerinde çalışan sahte atasözü/yer ismi üreten dosyalarını çağırmaktadır. Aşağıdaki yöntemlerden birini kullanarak, bot sunucusu ve sahte çıktıların üretimini sağlayan kodların aynı dilin çalışma zamanı üzerinde yer almasını sağlayabilir, arada yer alan I/O bazlı haberleşmeden kurtulabiliriz.

* Bot sunucusunu [lua-telegram-bot](https://github.com/cosmonawt/lua-telegram-bot) kullanarak Lua dilini kullanarak gerçeklemek.
* Lua dilinde yazılan `torch-rnn` modelini JavaScript dilini kullanarak gerçeklemek ve bir Node.js paketi haline getirmek. Sinir ağlarının yazılması için [synaptic.js](https://caza.la/synaptic/#/) kütüphanesinden faydalanılabilir.