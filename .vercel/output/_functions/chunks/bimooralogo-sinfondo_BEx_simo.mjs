const LogoSinFondo = new Proxy({"src":"/_astro/bimooralogo-sinfondo.BdCUS6Qr.png","width":320,"height":320,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/omarbermejo/dev/bimoora-comming-soon/src/assets/bimooralogo-sinfondo.png";
							}
							
							return target[name];
						}
					});

export { LogoSinFondo as L };
