let messages = {};

export default function handler(req, res){

  if(req.method === "POST"){

    const { city, line, text, rider } = req.body;

    const room = `${city}-${line}`;

    if(!messages[room]){

      messages[room] = [];

    }

    messages[room].push({

      text,
      rider,
      time: Date.now()

    });

    messages[room] = messages[room].slice(-50);

    res.status(200).json({ success:true });

  }

  else if(req.method === "GET"){

    const { city, line } = req.query;

    const room = `${city}-${line}`;

    res.status(200).json(messages[room] || []);

  }

}
