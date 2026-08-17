# Calculator Experiment V1

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

## About

This is the first iteration of an experiment to see how well ChatGPT can design and implement a calculator app. The command it was given was very simple
and straightforward:

```
Make me a simple calculator in React. The usual 3x3 orientation of numbers, with zero at the bottom center, decimal to the left of that, equal to the 
right, clear at the top left, and the 4 basic operations along the right side of it all. The top having a display to show the current calculation or 
solution.
```

This first experiment was just to see what it could produce given the smallest possible guidelines.

## Results

### UI and Functionality

Visually, it did a very good job making a very sleek looking calculator, reminiscent of a smartphone's. Rounded corners, operations on the right, an 
orange "=" button. It also gave the individual buttons a slight sense of depth with a shadow under the bottom border. 

The top display showing the current calculation has the most problems visually and functionally. When starting with a blank slate, the first number 
inputted shows at the bottom line. However, once an operation is selected, the top line becomes the number and that operation, while the bottom line 
stays as just the number. Input another number, the bottom line changes, the top line stays the same. Then input another operation it automatically 
calculates the answer from the previous operation then put's that number plus the new operation in the top line.  

This has two issues. 
1. It looks confusing. The bottom line sometimes showing the answer and sometimes showing the most recent input makes it hard to tell what step you're on as a user.
1. It cannot do order of operation properly. 5 - 5 x 6 should equal -25. However, it will always calculate the 5 - 5 first, making it a 0 x 6 and outputting 0.

You can operate the app through the keyboard, and it has visual indicators of what buttons are hovered or focused, but the inability to navigate the 
calculator keyboard with arrow keys is also an oversight.

Another visual issue comes when taking a non-multiple of 3 and dividing it by 3. It knows to cut off/round the repeating decimal, but the text itself 
gets much bigger and bolder. It doesn't break out of the container, but it is a very noticable since the font reverst back to it's original smaller 
version on typing in another number.

### Code

The agent did a good job with code simplicity for the main app. Most of the code is in CSS styling, with around 175 lines in one css file, and the tsx
file that renders the app coming in at around 150 lines. It also seems to have good practices when it comes to React hooks, including having a cleanup
in a useEffect hook. The code is also fairly neat and readable, large blocks of reusable logic split into their own properly named functions. I would
like if it had commented it's files for more ease of understanding.

But the main issue is in the project architecture. As this is just a React calculator, with all state in the browser, nothing getting saved or stored, 
there shouldn't be much outside the page, layout, and global files, plus whatever dependencies are needed for compliation and build. However, it 
brought in supplemental directories such as "/drizzle", "/examples", and "/db". All of these are either related to potential api's or databases, which
are not part of this first project.

Upon asking the agent, it said it simply copied all the React starter code from a pre-provided skill for creating React apps in Codex. The cause is
understandable but also highlights how quickly an agentic coding tool will proactively add unwanted or uneeded elements into a codebase. While these
additions aren't harmful, they are clutter and do not make sense in the context of this simple app.

## To test next
Repeatability - does it create the exact same calculator in a new command?