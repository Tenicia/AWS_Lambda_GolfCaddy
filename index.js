'use strict';
var Alexa = require("alexa-sdk");
var appId = 'amzn1.echo-sdk-ams.app.your-skill-id';

exports.handler = function (event, context) {
    try {
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/** Called when the session starts */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
    + ", sessionId=" + session.sessionId);
}

/** Called when the user invokes the skill without specifying what they want. */
function onLaunch(launchRequest, session, callback) {
  var speechOutput = "Welcome to my Golf Caddie! I can tell you facts about all the golf ruless. On which rule do you need information?"
  var reprompt = "Which rule are you interested in? You can find out about unplayable ball, out of bound, relief, yellow water hazard, red water hazard, lifting the ball, ball lost, clubs, ball at rest moved, loose impediments, tee shot, teeing ground, and repair green."
  var header = "Golf Rule Facts!"
  var shouldEndSession = false
  var sessionAttributes = {
      "speechOutput" : speechOutput,
      "repromptText" : reprompt
  }
  callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}


/** Called when the user specifies an intent for this skill. */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    if (intentName == "GetGolfRuleIntent") {
      handleGetGolfRuleRequest(intent, session, callback);
    } else if (intentName == "AMAZON.HelpIntent") {
      handleHelpRequest(intent, session, callback);
    } else if (intentName == "AMAZON.StopIntent" || intentName == "AMAZON.CancelIntent") {
      handleFinishSessionRequest(intent, session, callback);
    } else {
      throw "Invalid intent";
    }
}

/** Called when the user ends the session - is not called when the skill returns shouldEndSession=true. */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Helper functions to build responses for Alexa -------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

var golfRules = {
  "provisional ball" : {
    "rule" : "A provisional ball is a ball played for a ball that may be lost outside a water hazard or may be out of bounds. The player of the provisional ball must announce to his opponent in match play or his marker or a fellow-competitor in stroke play that he intends to play a provisional ball."
  },
  "teeing ground" : {
    "rule" : " The teeing ground is the starting place for the hole to be played. It is a rectangular area two club-lengths in depth, the front and the sides of which are defined by the outside limits of two tee-markers. A ball is outside the teeing ground when all of it lies outside the teeing ground."
  },
  "clubs" : {
    "rule" : "The player must not start a stipulated round with more than fourteen clubs. He is limited to the clubs thus selected for that round, except that if he started with fewer than fourteen clubs, he may add any number, provided his total number does not exceed fourteen. The addition of a club or clubs must not unduly delay play and the player must not add or borrow any club selected for play by any other person playing on the course or by assembling components carried by or for the player during the stipulated round."
  },
  "ball played as it lies" : {
    "rule" : "The ball must be played as it lies, except as otherwise provided in the Rules."
  },
  "lifting the ball" : {
    "rule" : "The position of the ball must be marked before it is lifted under a Rule that requires it to be replaced. If it is not marked, the player incurs a penalty of one stroke and the ball must be replaced."
  },
  "ball lost" : {
    "rule" : "It is not found or identified as his by the player within five minutes after the player’s side or his or their caddies have begun to search for it."
  },
  "repair green" : {
    "rule" : "The player may repair an old hole plug or damage to the putting green caused by the impact of a ball, whether or not the player’s ball lies on the putting green. If a ball or ball-marker is accidentally moved in the process of the repair, the ball or ball-marker must be replaced. There is no penalty, provided the movement of the ball or ball-marker is directly attributable to the specific act of repairing an old hole plug or damage to the putting green caused by the impact of a ball. Otherwise, Rule 18 applies.Any other damage to the putting green must not be repaired if it might assist the player in his subsequent play of the hole. "
  },
  "tee shot" : {
    "rule" : "If a ball, when not in play, falls off a tee or is knocked off a tee by the player in addressing it, it may be re-teed, without penalty. However, if a stroke is made at the ball in these circumstances, whether the ball is moving or not, the stroke counts, but there is no penalty."
  },
  "relief" : {
    "rule" : "The nearest point of relief is the reference point for taking relief without penalty from interference by an immovable obstruction, an abnormal ground condition or a wrong putting green."
  },
  "unplayable" : {
    "rule" : "The player may deem his ball unplayable at any place on the course, except when the ball is in a water hazard. The player is the sole judge as to whether his ball is unplayable. If the player deems his ball to be unplayable, the penalty is one stroke."
  },
  "bunker" : {
    "rule" : "The player may deem his ball unplayable at any place on the course, except when the ball is in a water hazard. The player is the sole judge as to whether his ball is unplayable. If the player deems his ball to be unplayable, the penalty is one stroke. If the unplayable ball is in a bunker, the ball must be dropped in the bunker."
  },
  "yellow water hazard" : {
    "rule" : "If a ball is found in the water hazard or if it is known or virtually certain that a ball that has not been found is in the water hazard (whether the ball lies in water or not), the player may under penalty of one stroke: proceed under the stroke and distance by playing a ball as nearly as possible at the spot from which the original ball was last played, or drop a ball behind the water hazard, keeping the point at which the original ball last crossed the margin of the water hazard directly between the hole and the spot on which the ball is dropped, with no limit to how far behind the water hazard the ball may be dropped."
  },
  "red water hazard" : {
    "rule" : "If a ball is found in the water hazard or if it is known or virtually certain that a ball that has not been found is in the water hazard (whether the ball lies in water or not), the player may under penalty of one stroke: proceed under the stroke and distance by playing a ball as nearly as possible at the spot from which the original ball was last played, or drop a ball behind the water hazard, keeping the point at which the original ball last crossed the margin of the water hazard directly between the hole and the spot on which the ball is dropped, with no limit to how far behind the water hazard the ball may be dropped. As additional options available only if the ball last crossed the margin of a lateral water hazard, drop a ball outside the water hazard within two club-lengths of and not nearer the hole than (i) the point where the original ball last crossed the margin of the water hazard or a point on the opposite margin of the water hazard equidistant from the hole."
  },
  "out of bounds" : {
    "rule" : "Out of bounds is beyond the boundaries of the course or any part of the course so marked by the Committee. When out of bounds is defined by reference to stakes or a fence or as being beyond stakes or a fence, the out of bounds line is determined by the nearest inside points at ground level of the stakes or fence posts (excluding angled supports). When both stakes and lines are used to indicate out of bounds, the stakes identify out of bounds and the lines define out of bounds. When out of bounds is defined by a line on the ground, the line itself is out of bounds. The out of bounds line extends vertically upwards and downwards. A ball is out of bounds when all of it lies out of bounds. A player may stand out of bounds to play a ball lying within bounds. Objects defining out of bounds such as walls, fences, stakes and railings are not obstructions and are deemed to be fixed. Stakes identifying out of bounds are not obstructions and are deemed to be fixed."
  },
  "embedded ball" : {
    "rule" : "A ball is “embedded” when it is in its own pitch-mark and part of the ball is below the level of the ground. A ball does not necessarily have to touch the soil to be embedded (e.g. grass, loose impediments and the like may intervene between the ball and the soil)"
  },
  "abnormal ground" : {
    "rule" : "An abnormal ground condition is any casual water, ground under repair or hole, cast or runway on the course made by a burrowing animal, a reptile or a bird. Interference by an abnormal ground condition occurs when a ball lies in or touches the condition or when the condition interferes with the player’s stance or the area of his intended swing. If the player’s ball lies on the putting green, interference also occurs if an abnormal ground condition on the putting green intervenes on his line of putt. Otherwise, intervention on the line of play is not, of itself, interference under this Rule."
  },
  "wrong green" : {
    "rule" : "If a player’s ball lies on a wrong putting green, he must not play the ball as it lies. He must take relief, without penalty. A wrong putting green is any putting green other than that of the hole being played. Unless otherwise prescribed by the Committee, this term includes a practice putting green or pitching green on the course."
  },
  "cleaning ball" : {
    "rule" : "A ball on the putting green may be cleaned when lifted. Elsewhere, a ball may be cleaned when lifted, except when it has been lifted: to determine if it is unfit for play, for identification, in which case it may be cleaned only to the extent necessary for identification or because it is assisting or interfering with play."
  },
  "ball at rest moved" : {
    "rule" : "If a ball at rest is moved by an outside agency, there is no penalty and the ball must be replaced. "
  },
  "obstruction" : {
    "rule" : "If a ball in play and at rest is moved by another ball in motion after a stroke, the moved ball must be replaced."
  },
  "loose impediments" : {
    "rule" : "Loose impediments are natural objects, including: stones, leaves, twigs, branches and the like,  dung, and worms, insects and the like, and the casts and heaps made by them, provided they are not: fixed or growing, solidly embedded, or adhering to the ball. Sand and loose soil are loose impediments on the putting green, but not elsewhere. Snow and natural ice, other than frost, are either casual water or loose impediments at the option of the player. Dew and frost are not loose impediments."
  }
}

function handleGetGolfRuleRequest(intent, session, callback) {
    var rule = intent.slots.glossary.value.toLowerCase();
    rule = matchRule(rule);
    if (!golfRules[rule]) {
        var speechOutput = "That's not a rule. Try asking about another rule.";
        var repromptText = "Try asking about another golf rule.";
        var header = "Does Not Exist";
    } else {
        var direction = golfRules[rule].rule;
        var speechOutput = direction;
        var repromptText = "Do you want to hear about more golf rules?";
        var header = capitalizeFirst(rule);
    }
    var shouldEndSession = false;
    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession));
}

function matchRule(rule) {
  switch(rule) {
    case "bunkers":
    	return "bunker"
    case "embedded balls":
        return "embedded ball"
   	case "obstructions":
        return "obstruction"
    case "water hazard":
        return "red water hazard"
    case "loose impediments":
        return "loose impediments"
    case "cleaning ball":
        return "cleaning ball"
    case "wrong green":
        return "wrong green"
    case "abnormal ground":
        return "abnormal ground"
    case "ball lost":
        return "ball lost"
    default:
        return rule
   }
}

function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }
    var speechOutput = "I can tell you the rules in golf, for example nearest point of relief, embedded ball, teeing ground, water hazard. Which rule are you interested in?"
    var repromptText = speechOutput
    var shouldEndSession = false
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye! Thank you for using my Golf Caddie!", "", true));
}
