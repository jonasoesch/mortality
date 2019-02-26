# Redesign of the Bloomberg story on "How Americans Die"

The [original story](https://www.bloomberg.com/graphics/dataview/how-americans-die/) is a beautiful example of storytelling through visualizations. They use a lot of animations to transition from one visualization to the next.

This project intends to address some of the problems found in the transitions and to test what works best with users.



## Installation

The visualization was developed with Typescript and d3. It also requires Python 3 and Flask to provide the API-backend to test the logger. But this is not essential.


1. Clone the repository:

```
git clone https://github.com/jonasoesch/mortality
```

2. Change into the folder:

```
cd mortality
```

3. Install the required node modules:

```
npm install
```

4. Run the Typescript server. The project is now available on http://localhost:8080/

```
npm run start
```

### Testing the logger

1. Change into the `logger` directory

```
cd logger
```

2. Install the required python3 libraries

```
pip install -r requirements.txt
````

3. Run the webserver providing the API

```
FLASK_APP=start.py flask run
```
