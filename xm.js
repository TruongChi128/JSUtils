// v1
articles = document.getElementsByTagName("article");
Array.from(articles).forEach(article -> {
	imgs = article.getElementsByTagName("img");
	for (let i of imgs) {
		if(imgs[i].getAttribute("src").contains())
	}
})

// v2
const boxesToHandle = ['Chuyện Trò', 'Lều báo'];
var needToProcess = false;
var currentBox = document.evaluate("//*[@itemprop='itemListElement'][last()]//span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
for (box of boxesToHandle) {
	if(currentBox.textContent.includes(box)) {
		needToProcess = true;
		break;
	}
}
if (needToProcess){
	const linksToHandle = ['https://img.upanh.tv/2023/12/23/2024.gif',
	'https://img.upanh.tv/2023/12/15/anh-lon-gai-2d8fb6b5011679035.jpg',
	'https://img.upanh.tv/2023/12/15/E0FBYu1VUAMOtiM22e0751c2a7d4283.jpg',
	'https://img.upanh.tv/2023/12/15/E0E-Kf3UUAEVF5Vcf700ecb42c7236c.jpg',
	'https://img.upanh.tv/2023/12/23/xamvn.jpg',
	'https://img.upanh.tv/2023/12/16/xamvn.jpg',
	'https://img.upanh.tv/2023/12/16/xanmxin.jpg',
	'https://img.upanh.tv/2023/12/16/photo_2022-03-13_23-29-29-3.jpg',
	'https://img.upanh.tv/2023/12/15/E0E-Kf3UUAEVF5Vcf700ecb42c7236c.jpg'
	];
	var imgs = document.querySelectorAll(".bbImageWrapper img");
	Array.from(imgs).forEach(img => {
		let currentLink = img.getAttribute("src");
		for (let link of linksToHandle){
			if (link === currentLink) {
				img.setAttribute("src", "");
				break;
			}
		}
	})
}
