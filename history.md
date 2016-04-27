# System deployment operation and maintenance logs

## 2016/04/12
- Node Install
	+ curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
	+ yum -y install nodejs
	+ yum install gcc-c++ make
- Nginx install
	+ sudo yum install epel-release
	+ sudo yum install nginx
	+ sudo /etc/init.d/nginx start
	+ [Reference](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-6-with-yum)
- nginx.conf: /etc/nginx/nginx.conf
- pm2 install: npm install -g pm2
- nginx update
	+ yum install http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm
	+ yum install nginx
	+ [Reference](http://serverfault.com/questions/688573/how-can-i-update-nginx-to-lastest-stable-version)
- Apache install: [Reference](https://support.rackspace.com/how-to/centos-6-apache-and-php-install/)
