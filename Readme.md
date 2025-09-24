run docker-compose up before starting teh app 


start the server -npm start 

start server with workers mentinod and debugger pm2 start server.js -i 1 --node-args="--inspect=9229"

list of server pm2 list 

stop server pm2 stop <server_name> 

stop server by id pm2 stop <id>

stop all servers   pm2 stop all 



to start the ollama modals 

$env:OLLAMA_HOST="0.0.0.0:11436"

ollama serve








test ollamam 
curl http://localhost:8080/api/chat -d '{
    "model": "llama3.1:8b",
    "messages": [{
      "role": "user",
      "content": "Hello there!"
    }],
    "stream": false
  }'
  echo -e "\n"  # Add newline between requests
done

curl -X POST "http://localhost:8080/api/chat" \
-H "Content-Type: application/json" \
-d @scripts/prompts.json