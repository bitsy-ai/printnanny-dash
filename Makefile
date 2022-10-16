.PHONY: install-fake-services uninstall-fake-services

install-fake-services:
	cp systemd/mainsail.service /etc/systemd/system/mainsail.service
	cp systemd/octoprint.service /etc/systemd/system/octoprint.service
	cp systemd/printnanny-vision.service /etc/systemd/system/printnanny-vision.service
	cp systemd/syncthing.service /etc/systemd/system/syncthing.service
	systemctl daemon-reload

uninstall-fake-services:
	rm /etc/systemd/system/mainsail.service
	rm /etc/systemd/system/octoprint.service
	rm /etc/systemd/system/printnanny-vision.service
	rm /etc/systemd/system/syncthing.service
	systemctl daemon-reload
