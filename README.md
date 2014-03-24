PaintStream
===========

Allows you to paint with your friends

<h2>Installation Guide</h2>
<ol>
  <li>install mongodb</li>
  <li>install node</li>
  <li>clone repo</li>
  <li>npm install</li>
  <li>npm install faye</li>
</ol>

<h2>Run Guide</h2>
<ol>
  <li>mongod (run mongodb)</li>
  <li>node app.js (run app)</li>
</ol>

<h2>How it works</h2>
<p>
When a user goes to the main page, they're redirected to
a new instance of the collaborative drawing canvas.

Every client has a fayeClient and connects to faye.
When they draw they publish the change and everyone receives the
message and draws to their canvas.

The current clients are saved on a mongodb relates to the particular instance.
</p>
