# Fargo Bike Share Site

This is a quick side project I threw together to practice with a Sinatra API server and an Angular frontend. The idea for this webapp came out of frustration at the slowness of the Bike Share App. I performed a man in the middle attack on my phone to find the data source used by the phone app. Then by using the same headers and UA as my phone did, I created a Sinatra API that relayed the data with CORS support. This website consumes that API and uses basic Angualar logic to present the data to the user.
