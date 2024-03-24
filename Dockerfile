FROM ubuntu

RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm
RUN apt-get install -y libxss1

RUN apt-get install -y build-essential clang libdbus-1-dev libgtk-3-dev \
    libnotify-dev libasound2-dev libcap-dev \
    libcups2-dev libxtst-dev \
    libxss1 libnss3-dev gcc-multilib g++-multilib curl \
    gperf bison python3-dbusmock openjdk-8-jre

RUN apt-get install -y xvfb

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npm install
# RUN npm install mapbox-map-image-export -g

ENV MAPBOX_TOKEN=pk.eyJ1IjoicGFuendhcnp5d25pYWthIiwiYSI6ImNsdGcydzFtdTB4aDgyaXJ0cDBmZTl6aHMifQ.j3j7zHRSuFDj2maiwwvgVA
ENV DISPLAY=:1
ENV PORT=3000

EXPOSE 3000

# CMD ["Xvfb :1 -nolisten tcp -shmem &"]
# CMD export-map mapbox://styles/mapbox/streets-v9 -w=11in -h=8.5in -b=-7.1354,57.9095,-6.1357,58.516 -t=$MAPBOX_TOKEN -o=docker.png
# CMD ["node", "cmd.js", "-w=12in", "-h=15in", "-d=288", "-b=-74.20684568826417,40.528628319424,-73.70390910359002,41.004764240546365", "-t=$MAPBOX_TOKEN", "-o=renders/docker.png"]