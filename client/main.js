import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './main.html';
import { Tasks } from '../lib/task.js';

Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict();
});

Template.body.helpers({
	tasks: function() {
		const instance = Template.instance();
		if (instance.state.get('hideCompleted')){
			// if hide completed is checked, filter tasks
			return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt:-1 } });
		}
		// otherwise, return all of the tasks
		return Tasks.find({}, {sort : { text: -1} });
	},
	incompleteCount() {
		return Tasks.find({ checked: { $ne: true } }).count();
	},
});

Template.body.events({
	'submit .new-task'(event) {
		event.preventDefault();

		const target = event.target;
		const text = target.text.value;

		Tasks.insert({
			text,
			createdAt: new Date(),
		});

		target.text.value =''
	},
	'click .toggle-checked'() {

		Tasks.update(this._id, {
			$set: { checked: ! this.checked }
		});
	},
	'click .delete'() {
		Tasks.remove(this._id);
	},
	'change .hide-completed input' (event, instance) {
		instance.state.set('hideCompleted', event.target.checked);
	},
});