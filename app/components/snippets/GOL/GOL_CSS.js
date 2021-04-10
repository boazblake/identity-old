export default "* {\n  font-family: Montserrat, Sans-Serif;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  outline: none;\n}\n\n.toolbar {\n  line-height: 70px;\n  padding: 10px;\n  border: 1px solid #ecf0f1;\n  justify-content: space-between;\n}\n\n.topRow {\n  display: flex;\n  flex-flow: wrap;\n  justify-content: space-around;\n}\n\n.bottomRow {\n  display: flex;\n  flex-flow: wrap;\n  justify-content: space-around;\n}\n\nbutton {\n\tbox-shadow: 0px 10px 14px -7px #276873;\n\tbackground:linear-gradient(to bottom, #599bb3 5%, #408c99 100%);\n\tbackground-color:#599bb3;\n\tborder-radius:8px;\n\tdisplay:inline-block;\n\tcursor:pointer;\n\tcolor:#ffffff;\n\tfont-family:Arial;\n\tfont-size:20px;\n\tfont-weight:bold;\n\tpadding:13px 32px;\n\ttext-decoration:none;\n\ttext-shadow:0px 1px 0px #3d768a;\n}\nbutton:hover {\n\tbackground:linear-gradient(to bottom, #408c99 5%, #599bb3 100%);\n\tbackground-color:#408c99;\n}\nbutton:active {\n\tposition:relative;\n\ttop:1px;\n}\n\nlabel > * {\n  padding: 10px;\n  margin: 10px;\n\tbackground: #1abc9c;\n\tcolor: #fff;\n\tfont-size: 1em;\n\tline-height: 30px;\n\ttext-align: center;\n\ttext-shadow: 0 1px 0 rgba(255,255,255,0.2);\n\tborder-radius: 15px;\n}\n\n.board {\n  display: flex;\n  flex-flow: wrap;\n  width: 800px;\n  background: #ecf0f1;\n}\n\n.cell {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid #8e44ad;\n  cursor: pointer;\n}\n\n.alive {\n  background: #8e44ad;\n}\n\n.dead {\n  background: #ecf0f1;\n}"
