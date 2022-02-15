import React, { useEffect, useState, useCallback } from "react";
import { Grid } from "semantic-ui-react";
import Adapter from "../Adapter";
import TVShowList from "./TVShowList";
import Nav from "./Nav";
import SelectedShowContainer from "./SelectedShowContainer";

function App() {
  const [page, setPage]= useState(1)
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShow, setSelectedShow] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [filterByRating, setFilterByRating] = useState("");
  
  let displayShows = shows;
  
 
 const handleScroll = useCallback(() => {
    console.log({page})
    if ((window.scrollY + window.innerHeight) >= document.body.scrollHeight){
      setPage(page+1)
    }
    }, [page])  

 useEffect(() => {
    Adapter.getShows(page).then((shows) => setShows(shows));    
  }, [page]);

  useEffect(() => {  
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  
 
  

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  function handleSearch(e) {
    setSearchTerm(e.target.value.toLowerCase());
  }

  function handleFilter(e) {
    e.target.value === "No Filter" ? setFilterByRating("") : setFilterByRating(e.target.value)
    }

  function selectShow(show) {
      Adapter.getShowEpisodes(show.id).then((episodes) => {
      setSelectedShow(show);
      setEpisodes(episodes);      
    });
  
  }

  
  if (filterByRating) {
    displayShows = displayShows.filter((s) => s.rating.average >= filterByRating);
  }

  

  return (
    <div >
      <Nav
        handleFilter={handleFilter}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
      />
      <Grid celled>
        <Grid.Column width={5}>
          {!!selectedShow ? (
            <SelectedShowContainer
              selectedShow={selectedShow}
              allEpisodes={episodes}
            />
          ) : (
            <div />
          )}
        </Grid.Column>
          <div >
            <Grid.Column width={11}>
                <TVShowList               
                  shows={displayShows}
                  selectShow={selectShow}
                  searchTerm={searchTerm}
                  handleScroll={handleScroll}
                />
            </Grid.Column>
          </div>
      </Grid>
    </div>
  );
}

export default App;
