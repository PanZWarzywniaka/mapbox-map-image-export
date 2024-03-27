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

ENV MAPBOX_TOKEN=pk.eyJ1IjoicGFuendhcnp5d25pYWthIiwiYSI6ImNsdGcydzFtdTB4aDgyaXJ0cDBmZTl6aHMifQ.j3j7zHRSuFDj2maiwwvgVA
ENV DISPLAY=:1
ENV PORT=3000

EXPOSE 3000

COPY . .

# start Xvfb server and start a server
CMD Xvfb :1 -nolisten tcp -shmem & node server.js