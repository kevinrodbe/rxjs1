import $ from 'jquery';
import Rx from 'rxjs/Rx';

// # create observable sequences from arrays, events and array-like objects {
const btn = $('#btn')
const input = $('#input')
const output1 = $('#output1')
const output2 = $('#output2')
/*

BB tip:
variable is an actual Observable and represents a stream

variable$
*/

/*
1° actual element
2° type of event we want

that's all to creating an Observable (w're creating from the event).
Now we need to subscribe to observables
 */
const btnStream$ = Rx.Observable.fromEvent(btn, 'click')
const inputStream$ = Rx.Observable.fromEvent(input, 'keyup')
const moveStream$ = Rx.Observable.fromEvent(document, 'mousemove')

/*
going to take 3 functions:
1° going to be to return the stream of the data in the stream
2° to return any errors if there are any
3° when its' completed
 */
btnStream$.subscribe(
	function (e) {
		console.log('clicked')
	},
	function (err) {
		console.log(err)
	},
	function () {
		console.log('completed')
	}
)

inputStream$.subscribe(
	function (e) {
		console.log(e.currentTarget.value)
		output1.html(e.target.value)
	},
	function (err) {
		console.log(err)
	},
	function () {
		console.log('completed')
	}
)

moveStream$.subscribe(
	function (e) {
		output2.html('x: ' + e.clientX + '		y: ' + e.clientY)
	},
	function (err) {
		console.log(err)
	},
	function () {
		console.log('completed')
	}
)

/**
 *
 *	Arrays
 *
 */
const numbers = [33, 44, 55, 66, 77]

const numbers$ = Rx.Observable.from(numbers)

numbers$.subscribe(
	v => {
		console.log(v)
	},
	err => {
		console.log(err)
	},
	complete =>{
		console.log('completed')
	}
)

const posts = [
	{title: 'Post one', body: 'this is the body'},
	{title: 'Post two', body: 'this is the body'},
	{title: 'Post three', body: 'this is the body'}
]

const postOutput = $('#posts')

const posts$ = Rx.Observable.from(posts)

posts$.subscribe(
	post => {
		console.log(post)
		$('#posts').append('<li><h3>' + post.title + '</h3><p>' + post.body + '</p></li>')
	},
	err => {
		console.log(err)
	},
	complete =>{
		console.log('completed')
	}
)

// create a set
// is an array that can have any type of data,
// you can have strings, numbers or objects
const set = new Set(['Hello', 44, {title: 'My title'}])

// now create a stream from that
const set$ = Rx.Observable.from(set)

set$.subscribe(
	v => {
		console.log(v)
	},
	err => {
		console.log(err)
	},
	complete =>{
		console.log('completed')
	}
)

// create a map
// is basically an array of key-value pairs
const map = new Map([[1,2], [3,4], [5,6]])

// now create a stream from that
const map$ = Rx.Observable.from(map)

map$.subscribe(
	v => {
		console.log(v)
	},
	err => {
		console.log(err)
	},
	complete =>{
		console.log('completed')
	}
)

// # create observable sequences from arrays, events and array-like objects }

// # create observable sequences from scratch {
const source1$ = new Rx.Observable(observer => {
	console.log('Creating observable')
	//	if we want to admit value, we need to take that observer and call ".next"
	observer.next('Hello Marte')
	observer.next('Anther value')

	// create a error, this stop function
	observer.error(new Error('Error: something went wrong xd'))

	setTimeout(() => {
		observer.next('yet another value')
		observer.complete()
	}, 3000)
})

// catch error with "of"
// this, take whatever you pass in and turns that into an observable
source1$
.catch(err => Rx.Observable.of(err))
.subscribe(
	v => {
		console.log(v)
	},
	err => {
		console.log(err)
	},
	complete =>{
		console.log('completed')
	}
)
// # create observable sequences from scratch }


// # create observable sequences from a promise {

const myPromise = new Promise((resolve, reject) => {
	console.log('creating promise')
	setTimeout(() => {
		resolve('hello from promise')
	}, 3000)
})

/*
myPromise.then(x => {
	console.log(x)
})
*/

// if we want to take this in return as an observable
const source2$ = Rx.Observable.fromPromise(myPromise)

source2$.subscribe(x => console.log(x))


//	promise 2

function getUser (username) {
	return $.ajax({
		url: 'https://api.github.com/users/' + username,
		dataType: 'jsonp'
	}).promise()
}

Rx.Observable.fromPromise(getUser('kevinrodbe'))
	.subscribe(x => {
		console.log(x)
		$('#name').text(x.data.name)
		$('#blog').text(x.data.blog)
		$('#repos').text(x.data.public_repos)
	})

// create an input form where we can change the username
// and have that output result as a stream
const inputSource = $('#input2')

const inputSource$ = Rx.Observable.fromEvent(inputSource, 'keyup')

// OJO: use double subscribe is not the right way
inputSource$.subscribe(e => {
	Rx.Observable.fromPromise(getUser(e.target.value))
	.subscribe(x => {
		$('#name2').text(x.data.name)
		$('#blog2').text(x.data.blog)
		$('#repos2').text(x.data.public_repos)
	})
})

// # create observable sequences from a promise }


// # interval, timer, range {
// is really helpful for just testing, learning in general

// interval
const source3$ = Rx.Observable.interval(100)
															.take(5)

source3$.subscribe(
	x => {
		console.log(x)
	},
	err => {
		console.log(err)
	},
	complete =>{
		console.log('completed interval')
	}
)

// timer
// 1° time page loaded
// 2° time between each one
const source4$ = Rx.Observable.timer(4000, 1000)
															.take(5)

source4$.subscribe(
	x => {
		console.log(x)
	},
	err => {
		console.log(err)
	},
	complete =>{
		console.log('completed timer')
	}
)

// range
// 1° start
// 2° stop
const source5$ = Rx.Observable.range(0, 5)

source5$.subscribe(
	x => {
		console.log(x)
	},
	err => {
		console.log(err)
	},
	complete =>{
		console.log('completed range')
	}
)

// # interval, timer, range }



// # map and pluck {
// pluck is kind of simpler version of map
// map: applies a function to each item that's emitted by the source Observable
// and it returns an Observable that he missed the results of that function.
// we can essentially take any of the data that submitted
// and just manipulated in different ways

//	ej 1
const source6$ = Rx.Observable.interval(1000)
															.take(10)
															.map(v => v * v)

source6$.subscribe(v => console.log(v))

//	eje 2
const source7$ = Rx.Observable.from(['gohan', 'osa', 'blanca'])
															.map(v => v.toUpperCase())
															.map(v => 'I am ' + v )

source7$.subscribe(v => console.log(v))

//	ej 3
Rx.Observable.fromPromise(getUser('kevinrodbe'))
	.map(x => x.data.name)
	.subscribe(name => {
		console.log(name)
	})


// pluck

//	eje 1
const users = [
	{name: 'will', age: 11},
	{name: 'mike', age: 22},
	{name: 'paul', age: 33}
]

const users$ = Rx.Observable.from(users)
														.pluck('name')

users$.subscribe(x => console.log(x))

// # map and pluck }



// # merge and concat {
// merge is it allows us to merge 2 or more observables
// and can catalyze us to concatenate them wich means right after another alright

//	ej 1
Rx.Observable.of('Hello')
						.merge(Rx.Observable.of('everyone'))
						.subscribe(x => console.log(x))

//	ej 2: runing in the same time
Rx.Observable.interval(2000)
							.merge(Rx.Observable.interval(500))
							.take(25)
							.subscribe(x => console.log(x))

//	ej 3
const source8$ = Rx.Observable.interval(2000).map(v => 'merge 1')
const source9$ = Rx.Observable.interval(2000).map(v => 'merge 2')

Rx.Observable.merge(source8$, source9$)
							.take(25)
							.subscribe(x => console.log(x))


// cat will go one after another

//	ej 1
const source10$ = Rx.Observable.range(0, 5).map(v => 'source 10: ' + v)
const source11$ = Rx.Observable.range(6, 5).map(v => 'source 11: ' + v)

Rx.Observable.concat(source10$, source11$)
							.subscribe(x => console.log(x))


// # merge and concat }



// # mergeMap and switchMap {
// mergeMap: these do is essentially stop us from having to subscribe to nest subscribe

//	ej 1:
//	bad way
Rx.Observable.of('hello')
							.subscribe(v => {
								Rx.Observable.of(v + ' everyone1')
															.subscribe(x => console.log(x))
							})
// right way
Rx.Observable.of('hello')
						.mergeMap(v => {
							return Rx.Observable.of(v + ' everyone2')
						})
						.subscribe(x => console.log(x))

// switchMap: basically transforms the items that are emitted by an observable
// into observables and then flattens the missions all right into a single observable.
// now this used to be called flat map in Rx chance for ok which is now switchMap

//	ej 1
const inputSource3 = $('#input3')
const inputSource3$ = Rx.Observable.fromEvent(inputSource3, 'keyup')
												.map(e => e.target.value)
												.switchMap(v => {
													return Rx.Observable.fromPromise(getUser(v))
												})

inputSource3$.subscribe(x => {
	$('#name3').text(x.data.name)
	$('#blog3').text(x.data.blog)
	$('#repos3').text(x.data.public_repos)
})


// # mergeMap and switchMap }