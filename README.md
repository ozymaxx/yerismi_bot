# Sinir Ağları Tabanlı Yer İsimleri Üreten Telegram Botu
[Bu yazımda](https://ozymaxx.github.io/blog/2017/08/17/sahte-atasoz-yerismi/) yer alan sahte atasözü 
ve yer ismi üreten dil modellerinin çalıştırıldığı basit bir Telegram botu hazırladım. Bot, aşağıdaki komutları 
desteklemektedir:

* `yardım lütfen`: Botun içeriği ve kullanımı hakkında mesaj almanızı sağlar. 
* `bana atasözü üret`: Botun sahte atasözü üretmesini sağlar.
* `bana yer ismi üret`: Botun sahte yer ismi üretmesini sağlar.


## Nasıl kullanılır?
* Yukarıdaki yazımda yer alan Docker imajını, yazıda belirtildiği gibi açıyoruz. İlerleyen adımlarda belirtildiği
şekilde dil modellerimizi eğitiyoruz.

* [BotFather](https://t.me/botfather) kanalını kullanarak bir Telegram botu oluşturuyoruz.
`/newbot` komutu ile bir bot oluşturacağımızı belirtiyoruz. Bot yaratıcımız da bizden botumuza bir isim vermemizi
istiyor. Ardından botumuza bir kullanıcı ismi oluşturmamız isteniyor. Bu işlemlerin ardından botumuzun URL adresi ve 
bot üzerinde geliştirme yapabilmemiz için bir HTTP API anahtarı oluşturuluyor. Bu anahtarı bir yere kaydediyoruz
ve başkalarıyla paylaşmıyoruz.

* [Şu adreste](https://github.com/luarocks/luarocks/wiki/installation-instructions-for-unix) yer alan adımları takip ederek Lua ve Luarocks paketlerinin kurulumunu gerçekleştiriyoruz.

* `nn` isimli Lua paketini, Luarocks paket yöneticisini kullanarak `luarocks install nn` komutu ile yüklüyoruz.

* Şu [yazıda](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/) da görülebileceği üzere, aşağıdaki komutları
uygulayarak kaynak kodumuza uygun NPM ve Node.js paketlerinin kurulmasını sağlıyoruz:
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

* Telegram botunun oluşturulması esnasında sahip olduğumuz anahtarı, bir ortam değişkeni olarak depoluyoruz. Söz konusu
değişken, oluşturulan JS scriptleri tarafından kullanılmaktadır. Aşağıdaki komutları Docker imajımızın konsolu üzerinde çalıştırıyoruz:
    ```
    cd ..
    export BOT_TOKEN="<anathar>" 
    ```
    Bu komutta `<anahtar>` yerine elimizde bulunan anahtarı yazıyoruz.

* Son olarak, `node index.js` komutu ile bot sunucumuzu ayağa kaldırıyoruz. Artık botumuzu gönül rahatlığıyla kullanabiliriz!

## Tasarımı geliştirmek
Kullanım popularitesinden ötürü sohbet botunu TS kullanarak Node.js üzerinde gerçekledim. Node.js üzerinde çalışan bot sunucusu, Lua üzerinde çalışan yığın dosyalarını çağırmaktadır. Aşağıdaki yöntemlerden birini kullanarak, bot sunucusu ve sahte çıktıların üretimini sağlayan programların aynı dilin çalışma zamanı üzerinde yer almasını sağlayabilir, arada yer alan I/O bazlı haberleşmeden kurtulabiliriz:

* Bot sunucusunu [lua-telegram-bot](https://github.com/cosmonawt/lua-telegram-bot) kullanarak Lua dilini kullanarak gerçeklemek.
* Lua dilinde yazılan `torch-rnn` uygulamasını JavaScript dilini kullanarak gerçeklemek ve bir Node.js paketi haline getirmek. Sinir ağlarının yazılması için [synaptic.js](https://caza.la/synaptic/#/) kütüphanesinden faydalanılabilir.

## Not
Kaynak kodunda yer alan `utils` klasörü ve `.lua` uzantılı bütün dosyalar, [torch-rnn](https://github.com/jcjohnson/torch-rnn) alanından direkt olarak alınmıştır. `language_models` klasörü içerisinde ise dil modelleri yer almaktadır.
