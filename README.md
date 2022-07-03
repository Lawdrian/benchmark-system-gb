# Benchmark System GB

In diesem Projekt soll eine Web-Applikation mit folgendem Zweck entwickelt werden:

Betreiber von Gewächshäusern sollen über eine Weboberfläche Daten zu ihrem Betrieb erfassen können. 
Damit soll eine vereinfachte Ermittlung betrieblicher Ressourceneffizienz in Bezug auf CO2 und Wasser 
sowie eine Einordnung des Wasserverbrauchs anhand eines Benchmark-Systems im Vergleich zu anderen Betrieben möglich sein.

## Prerequisites
In order to develop this project, you need to have Node.js and Python installed.

Getting Python:

- Anaconda Distribution: [Download here](https://docs.anaconda.com/anaconda/install/)
- Standard Python: [Download here](https://www.python.org/downloads/)

Getting Node.js:

- Node.js: [Download here](https://nodejs.org/en/download/)


## Getting started

### 1. Clone the repository

Navigate to a local folder and type

``` 
git clone https://gitlab.lrz.de/hswt-bpi-2022/benchmark-system-gb.git 
```

### 2. Set up a virtual environment

A virtual environment for python ensures a synchronized development environment 
across all members of this project. The project uses **Python 3.9**.

#### 2.1 Set up a virtual environment using the _conda_ package manager:
    
_1. Make sure you have conda available, otherwise download it [here](https://docs.conda.io/projects/conda/en/latest/user-guide/install/download.html)_

_2. Open a command prompt with conda available on your PATH or an anaconda prompt_

_3. Navigate to your project folder_

```
cd path/to/your/benchmark-system-gb
```

_4. Create the virtual environment using conda_

```
conda env create --file environment.yml
```

_5. Make the environment available to your IDE_

This step depends on your specific IDE, but if you are using PyCharm,
look at step 3 of [this article](https://www.jetbrains.com/help/pycharm/conda-support-creating-conda-virtual-environment.html#fd8e0f43)
and choose _"Existing environment"_. Your newly created conda-environment should be
located at ``path/to/conda/installation/envs/benchmark-system-gb/``, where you 
should find the ``python.exe`` to select in PyCharm.

Alternatively, you can activate the environment for a command or conda prompt session using:

```
conda activate benchmark-system-gb
```

You must not leave the session before running the python command from 5. in your prompt.

#### 2.2 Set up a virtual environment using _conda_ and _PyCharm_:

Just follow the steps [here](https://www.jetbrains.com/help/pycharm/conda-support-creating-conda-virtual-environment.html#conda-requirements)
to set up a conda virtual environment using the **environment.yml** file.

#### 2.3 Set up a virtual environment in _PyCharm_ without using _conda_:

You can create a virtual environment in _PyCharm_ without using conda by following [these](https://www.jetbrains.com/help/pycharm/creating-virtual-environment.html#env-requirements) steps.
This approach uses the **requirements.txt** file to install the python dependencies. You have to keep 
track on the **correct python version** yourself.

### 3. Install Node.js dependencies

To install the dependencies for Node.js, execute the commands:

``` 
cd path/to/benchmark-system-gb/frontend
npm install
```

### 4. Run the development server

By this point you should be able to run the development server using:

```
cd path/to/benchmark-system-gb
python manage.py runserver
```

and in a separate command prompt:

```
cd path/to/benchmark-system-gb/frontend
npm run dev
```

## Configuring your IDE

Make sure that these things are set in your IDE:
- line seperator/ line ending = CRLF
- tab size = 4 spaces
- encoding = UTF-8
- Python Version = 3.9

## Configuring git
    
Please configure your git instance before developing the project:

    git config --global user.name "Your Name"
    git config --global user.email "your.mail@something.de"

## Developing the project

### Usage of branches and merge requests

If you want to develop parts of this project, first create a new branch from **dev**:

    git checkout dev
    git checkout -b <new branch name>
    git push --set-upstream origin <new branch name>
    
Then develop the project on this **new branch** before creating a merge request in GitLab to merge your branch
into the **dev** branch again. Please ensure that your code is working by merging the **dev** branch into
your branch _before_ asking for a merge. Especially, if there are commits on the **dev**
branch after you created **your new branch**.

First ensure, that you are working on **your new branch**:

    git checkout <your new branch>

Then, merge the **dev** branch into **your new branch**:

    git merge dev

If the merged version runs without conflicts, merge your changes into
**dev** by creating a merge request in GitLab.
    
