function Match(props) {
  const bgImage = "url(https://www.wallart.com/media/catalog/category/Premier_League_1.jpg)"

  return (
    <div>
      <div className="bg-[lightslategrey] rounded-t-xl px-2 py-1 flex justify-between items-center">
        <div>
          <h3 className="text-white font-semibold">
            {props.date}
          </h3>
        </div>
        <div className="bg-[skyblue] p-1 rounded-xl font-semibold">
          <h3>{props.status}</h3>
        </div>
      </div>
      <div 
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 rounded-b-xl p-2 shadow-xl"
        style={{ backgroundImage: bgImage }}
      >
        <div className="text-left">
          <h3 className="text-white text-xl font-medium">
            {props.homeTeam}
          </h3>
          <img 
            src={props.homeTeamLogo} 
            className="h-22 w-auto m-auto" 
          />
        </div>
        <div className="flex items-center justify-center bg-[skyblue] shadow-3xl text-lg font-semibold rounded-full h-10 w-10">
          <h2>VS</h2>
        </div>
        <div className="text-right">
          <h3 className="text-white text-xl  font-medium">
            {props.awayTeam}
          </h3>
          <img 
            src={props.awayTeamLogo} 
            className="h-22 w-auto m-auto" 
          />
        </div>
      </div>
    </div>
  )
}

export default Match