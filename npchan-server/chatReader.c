#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <curl/curl.h>

#define MAXDATASIZE 1024
#define TOKENSIZE 64

int main (int argc, char *argv[]) 
{
    CURL *curl = curl_easy_init();
    if(!curl) {
        printf("something went wrong !\n");
        printf("unable to open connection, closing program\n");
        return 1;
    } 
    CURLcode res;
    FILE* fp;
    FILE* stateFile;
    FILE* logFile;
    FILE* debugFile;
	FILE* tokenFile;
    char debugPath[MAXDATASIZE];
    char statePath[MAXDATASIZE];
    char buf[MAXDATASIZE];
    char savedStamp[MAXDATASIZE];
    char timeStamp[MAXDATASIZE];
    char lastLine[MAXDATASIZE];
    char json[MAXDATASIZE];
    char input[MAXDATASIZE];
	char tokenPath[MAXDATASIZE];
	char authToken[MAXDATASIZE];
	char authSequence[MAXDATASIZE];
    char* ret;
    char* tmp;
    char* usr;
    char* url;
    char* artist;
    char* title;
    char* cut;
    int lenA;
    int lenB;
    int total;
    int log = 0;

    /*check arguments and enable logging*/
    if (argc >=2) {
        if (argc == 4) {
            if (strcmp(argv[2], "-d") == 0){
                log = 1;
                strncpy(debugPath, argv[3], strlen(argv[3]) + 1);
                logFile = fopen(argv[1], "r");
                if(logFile == NULL) 
                {
                    printf("no log file here\n");
                    return 0;
                }
            }
            if (strcmp(argv[1], "-d") == 0){
                log = 1;
                strncpy(debugPath, argv[2], strlen(argv[2]) + 1);
                logFile = fopen(argv[3], "r");
                if(logFile == NULL) 
                {
                    printf("no log file here\n");
                    return 0;
                }
            }
        } 
        if (argc == 2){
            logFile = fopen(argv[1], "r");
            if(logFile == NULL) 
            {
                printf("no log file here\n");
                return 0;
            }
        }
    } else {
        printf("usage : %s path/to/log/file \n", argv[0]);
        printf("or %s path/to/log/file -d path/to/debug/file \n", argv[0]);
        return 0;
    }

    /*setting up the state file path and the token path*/
    strncpy(statePath, argv[0], MAXDATASIZE);
    lenA = strlen(statePath);
    cut = strrchr(statePath, '/');
    lenB = strlen(cut);
    statePath[lenA - lenB] = '\0';
	strncpy(tokenPath, statePath, lenA - lenB);
    strncat(statePath, "/chatReader.state", 17);
    strncat(tokenPath, "/chatReader.token", 17);

    /*set up curl*/
	tokenFile = fopen(tokenPath, "r");
	if(stateFile == NULL) //if file does not exist, create it
    {
        printf("No token file, you need a <chatReader.token> file to store an authorization token.\n");
		return 0;
    }
	fgets(authToken, TOKENSIZE, tokenFile);
	sprintf(authSequence, "Authorization: Token %s", authToken);
    curl_easy_setopt(curl, CURLOPT_URL, "your_hosted_bot.com/");	//change this to link to your discord bot
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Expect:");
    headers = curl_slist_append(headers, "Content-Type: application/json");
    headers = curl_slist_append(headers, authSequence);
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    /*reading the state file*/
    stateFile = fopen(statePath, "r+");
    if(stateFile == NULL) //if file does not exist, create it
    {
        stateFile = fopen(statePath, "w+");
        printf("No save file : creating it\n");
    }
    fgets(savedStamp, MAXDATASIZE, stateFile);
    fclose(stateFile);

    /*infinite reading loop starts*/
    fgets(lastLine, MAXDATASIZE, logFile);
    for(;;){
        //if (read(STDIN_FILENO, input, MAXDATASIZE) && strncmp(input, "q", 1) == 0){
        //        printf("exit... \n");
        //        curl_easy_cleanup(curl);
        //        return 0;
        //}

        if(strncmp(lastLine, buf, MAXDATASIZE)){
            strncpy(timeStamp, buf, 10);
            timeStamp[10] = '\0';
            if(strncmp(savedStamp, timeStamp, 10) < 0) {
                ret = strstr(buf, "is listening to [");
                if(ret != NULL){
                    //printf("ret : %s\n", ret);

                    /*extract username*/
                    usr = strstr(buf, " * ");
                    usr = usr+3;
                    lenA = strlen(usr);
                    cut = strstr(usr, " ");
                    lenB = strlen(cut);
                    usr[lenA - lenB] = '\0';
                    //printf("usr : %s\n", usr);

                    /*extract url*/
                    url = strstr(ret, "http");
                    lenA = strlen(url);
                    cut = strstr(url, " ");
                    lenB = strlen(cut);
                    url[lenA - lenB] = '\0';
                    //printf("url : %s\n", url);

                    /*extract artist*/
                    artist = cut+1;
                    lenA = strlen(artist);
                    cut = strstr(artist, " - ");
                    lenB = strlen(cut);
                    artist[lenA - lenB] = '\0';
                    //printf("artist : %s\n", artist);

                    /*extract title*/
                    title = cut+3;
                    lenA = strlen(title);
                    cut = strrchr(title, ']');
                    lenB = strlen(cut);
                    title[lenA - lenB] = '\0';
                    //printf("title : %s\n", title);


                    /*build json*/
                    sprintf(json, "{ \"time\" : \"%s\", \"user\" : \"%s\", \"artist\" : \"%s\", \"title\" : \"%s\", \"url\" : \"%s\" }", timeStamp, usr, artist, title, url);
                    if(log == 1){
                        debugFile = fopen(debugPath, "a");
                        total = fprintf(debugFile, "%s\n", json);
                        fclose(debugFile);
                    }

                    /*update last timestamp in savefile*/
                    stateFile = fopen(statePath, "r+");
                    total = fprintf(stateFile, "%s", timeStamp);
                    fclose(stateFile);

                    /*Send the json using whatever method is the best*/
                    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json);
                    res = curl_easy_perform(curl);
                    if(res != CURLE_OK) {
                      fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
                    }
                }
				ret = strstr(buf, "np!notify: ");
                if(ret != NULL){
					usr = strstr(buf, " <");
					usr = usr + 1;
					lenA = strlen(usr);
					cut = strstr(usr, "> ");
					lenB = strlen(usr);
					usr[lenA - lenB] = '\0';
					
					printf("new message from : %s", usr);
				}
            }
            strncpy(lastLine, buf, MAXDATASIZE);   
        } else {
            sleep(1);
        }
        fgets(buf, MAXDATASIZE, logFile);
    }
}
