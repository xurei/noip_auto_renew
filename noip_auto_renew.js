/**
 * Created by Olivier Bourdoux on 27/11/15.
 * olivier.bourdoux@gmail.com
 * http://www.xurei-design.be/
 *
 * Opens NoIP and updates every hosts on it. This ensures that an host is never
 * removed because of inactivity.
 */

var casper = require('casper').create({
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
		userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'
	},
});

//--- CONFIG ---------------------------------------------------------------

var config = require('config.js');
var username = config.username;
var password = config.password;
var domain = "https://www.noip.com/";

//--- LOGGING IN -----------------------------------------------------------
var host_links;

casper.start(domain+'/login', function() {
	this.echo ('Logging in as '+username+'...');
	this.fill('form[action="/login"]', { username: username, password: password }, true);
});

//--- UPDATING HOSTS -------------------------------------------------------
casper.thenOpen(domain+'/members/dns/', function() {
	this.echo ('Getting hosts links...');

	host_links = this.evaluate(function()
	{
		var links = document.querySelectorAll('a.bullet-modify');
		return Array.prototype.map.call(links, function(e) {
			return e.getAttribute('href');
		});
	});

	this.echo ("Found "+host_links.length+" host"+(host_links.length > 1 ? 's':''));

	for (var i in host_links)
	{
		var uri = host_links[i];
		casper.thenOpen(domain+'/members/dns/'+uri, function()
		{
			casper.echo ('Updating '+uri+'...');

			//Notinhg to do but clicking on the submit button. This counts as a renewal
			casper.click('input[type="submit"]');
		});
		casper.then(function(){
			casper.echo('Host updated');
		});
	}
	casper.then(casper.exit);
});

casper.run();