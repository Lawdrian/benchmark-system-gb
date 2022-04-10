# Benchmark System GB

Entwicklung eines Benchmark-Systems für Wasserverbrauch, sowie CO2- und Water-Footprint in der Gewächshaustechnik

## Prerequisites
In order to develop this project, you need to have Node.js and Python installed.

A package-manager like _pip_ or _conda_ is recommended to install the required packages efficiently
into a virtual python environment.


## Getting started

To clone this repository, simply navigate to a local folder and type 

``` 
git clone https://gitlab.lrz.de/hswt-bpi-2022/benchmark-system-gb.git 
```

Then you have to set up a virtual environment for python like described in 
in the following sources:
- Creating a virtual environment using _Conda_ and _PyCharm_
- Creating a virtual environment using _PyCharm_ **only**
- Creating a virtual environment using _venv_ and _pip_
- Creating a virtual environment using _conda_ **only**

You have to look up in the docs of your specific IDE how to use it 
with a virtual environment.

After all python requirements are installed, you have to install the Node.js
dependencies.

``` 
cd path/to//benchmark-system-gb/frontend
npm install
```

Then you should be able to run the development server using:

```
cd path/to/benchmark-system-gb
python manage.py runserver
```

and in a seperate comand prompt:

```
cd path/to//benchmark-system-gb/frontend
npm run dev
```
