/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function _drawHumanTaskIcon(paper, startX, startY)
{
	var path1 = paper.path("m 1,17 16,0 0,-1.7778 -5.333332,-3.5555 0,-1.7778 c 1.244444,0 1.244444,-2.3111 1.244444,-2.3111 l 0,-3.0222 C 12.555557,0.8221 9.0000001,1.0001 9.0000001,1.0001 c 0,0 -3.5555556,-0.178 -3.9111111,3.5555 l 0,3.0222 c 0,0 0,2.3111 1.2444443,2.3111 l 0,1.7778 L 1,15.2222 1,17 17,17");
	path1.attr({
		"opacity": 1,
		"stroke": "none",
		"fill": "#000" //姜黄
 	});

	var userTaskIcon = paper.set();
	userTaskIcon.push(path1);

	userTaskIcon.transform("T" + startX + "," + startY);
}

function _drawServiceTaskIcon(paper, startX, startY)
{
    var path1=paper.path("M7.95,0c2.25,0,4.07,1.79,4.07,4c0,2.21-1.82,4-4.07,4S3.89,6.21,3.89,4S5.71,0,7.95,0z M7.95,0  c2.25,0,4.07,1.79,4.07,4c0,2.21-1.82,4-4.07,4S3.89,6.21,3.89,4S5.71,0,7.95,0z M6.43,9.33h3.39c2.9,0,5.25,2.31,5.25,5.17v0.33  c0,1.12-2.35,1.17-5.25,1.17H6.43c-2.9,0-5.25,0-5.25-1.17V14.5C1.18,11.65,3.53,9.33,6.43,9.33L6.43,9.33z")
    path1.attr({
        "opacity": 1,
        "stroke": "none",
        "fill": "#FFB6C1"
    });

	var serviceTaskIcon = paper.set();
	serviceTaskIcon.push(path1);

	serviceTaskIcon.transform("T" + startX + "," + startY);
}

function _drawCaseTaskIcon(paper, startX, startY)
{
    var path1 = paper.path("M5 8 L9 4 L18 4 L 21 7");
    path1.attr({
        "opacity": 1,
        "stroke": "#000000",
        "fill": "#000000" //黑
    });

    var path2 = paper.path("M1 23 L1 4 L30 4 L30 23z");
    path2.attr({
        "opacity": 1,
        "stroke": "#000000",
        "fill": "#F4F6F7" //白
    });

    var caseTaskIcon = paper.set();
    caseTaskIcon.push(path1);
    caseTaskIcon.push(path2);

    caseTaskIcon.translate(startX, startY);
    caseTaskIcon.scale(0.7, 0.7);
}

function _drawProcessTaskIcon(paper, startX, startY)
{
    var path1 = paper.path("M1 23 L7 11 L1 0 L30 0 L 35 11 L 30 23z");
    path1.attr({
        "opacity": 1,
        "stroke": "#000000",
        "fill": "#F4F6F7"
    });

    var processTaskIcon = paper.set();
    processTaskIcon.push(path1);

    processTaskIcon.translate(startX, startY);
    processTaskIcon.scale(0.7, 0.7);
}

function _drawDecisionTaskIcon(paper, startX, startY)
{
    var path1 = paper.path("m 1,2 0,14 16,0 0,-14 z m 1.9,2.4000386 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m -8.67364,3.9 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m -8.67364,3.9 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z m 4.36364,0 3.7,0 0,2.7999224 -3.7,0 z");
    path1.attr({
        "opacity": 1,
        "stroke": "#000000",
        "fill": "#F4F6F7"
    });

    var decisionTaskIcon = paper.set();
    decisionTaskIcon.push(path1);

    decisionTaskIcon.translate(startX, startY);
    decisionTaskIcon.scale(0.7, 0.7);
}

function _drawHttpTaskIcon(paper, startX, startY)
{
    var path = paper.path("m 16.704699,5.9229055 q 0.358098,0 0.608767,0.2506681 0.250669,0.250668 0.250669,0.6087677 0,0.3580997 -0.250669,0.6087677 -0.250669,0.2506679 -0.608767,0.2506679 -0.358098,0 -0.608767,-0.2506679 -0.250669,-0.250668 -0.250669,-0.6087677 0,-0.3580997 0.250669,-0.6087677 0.250669,-0.2506681 0.608767,-0.2506681 z m 2.578308,-2.0053502 q -2.229162,0 -3.854034,0.6759125 -1.624871,0.6759067 -3.227361,2.2694472 -0.716197,0.725146 -1.575633,1.7457293 L 7.2329969,8.7876913 Q 7.0897576,8.8055849 7.000233,8.9309334 L 4.9948821,12.368677 q -0.035811,0.06267 -0.035811,0.143242 0,0.107426 0.080572,0.205905 l 0.5729577,0.572957 q 0.125334,0.116384 0.2864786,0.07162 l 2.4708789,-0.760963 2.5156417,2.515645 -0.76096,2.470876 q -0.009,0.02687 -0.009,0.08057 0,0.125338 0.08058,0.205905 l 0.572957,0.572958 q 0.170096,0.152194 0.349146,0.04476 l 3.437744,-2.005351 q 0.125335,-0.08953 0.143239,-0.232763 l 0.17905,-3.392986 q 1.02058,-0.859435 1.745729,-1.575629 1.67411,-1.6830612 2.309735,-3.2049805 0.635625,-1.5219191 0.635625,-3.8585111 0,-0.1253369 -0.08505,-0.2148575 -0.08505,-0.089526 -0.201431,-0.089526 z");
    path.attr({
        "opacity": 1,
        "stroke": "none",
        "fill": "#000" //绿
    });

    startX += -2;
    startY += -2;

    path.transform("T" + startX + "," + startY);

}

function _drawBusinessRuleTaskIcon(paper, startX, startY) {
    var path1 = paper.path("m 1,2 0,14 16,0 0,-14 z m 1.45458,5.6000386 2.90906,0 0,2.7999224 -2.90906,0 z m 4.36364,0 8.72718,0 0,2.7999224 -8.72718,0 z m -4.36364,4.1998844 2.90906,0 0,2.800116 -2.90906,0 z m 4.36364,0 8.72718,0 0,2.800116 -8.72718,0 z");
    path1.attr({
        "stroke": "none",
        "fill": "#72a7d0"
    });

    var businessRuleTaskIcon = paper.set();
    businessRuleTaskIcon.push(path1);

    businessRuleTaskIcon.transform("T" + startX + "," + startY);
}

function _drawTimerEventListenerIcon(paper, element)
{
	var x = element.x + (element.width / 2);
    var y = element.y + (element.height / 2);

	var circle = paper.circle(x, y, 10);

	circle.attr({"stroke-width": 1,
		"stroke": "black",
		"fill": "none"
 	});

	var path = paper.path("M 10 0 C 4.4771525 0 0 4.4771525 0 10 C 0 15.522847 4.4771525 20 10 20 C 15.522847 20 20 15.522847 20 10 C 20 4.4771525 15.522847 1.1842379e-15 10 0 z M 9.09375 1.03125 C 9.2292164 1.0174926 9.362825 1.0389311 9.5 1.03125 L 9.5 3.5 L 10.5 3.5 L 10.5 1.03125 C 15.063526 1.2867831 18.713217 4.9364738 18.96875 9.5 L 16.5 9.5 L 16.5 10.5 L 18.96875 10.5 C 18.713217 15.063526 15.063526 18.713217 10.5 18.96875 L 10.5 16.5 L 9.5 16.5 L 9.5 18.96875 C 4.9364738 18.713217 1.2867831 15.063526 1.03125 10.5 L 3.5 10.5 L 3.5 9.5 L 1.03125 9.5 C 1.279102 5.0736488 4.7225326 1.4751713 9.09375 1.03125 z M 9.5 5 L 9.5 8.0625 C 8.6373007 8.2844627 8 9.0680195 8 10 C 8 11.104569 8.8954305 12 10 12 C 10.931981 12 11.715537 11.362699 11.9375 10.5 L 14 10.5 L 14 9.5 L 11.9375 9.5 C 11.756642 8.7970599 11.20294 8.2433585 10.5 8.0625 L 10.5 5 L 9.5 5 z");
	path.attr({
		"stroke": "none",
		"fill": "#585858"
 	});
	path.transform("T" + (element.x + 5) + "," + (element.y + 5));
	return path;
}

function _drawUserEventListenerIcon(paper, element) {
    var userTaskIcon = paper.set();
    var path1 = paper.path("M0.585,24.167h24.083v-7.833c0,0-2.333-3.917-7.083-5.167h-9.25 c-4.417,1.333-7.833,5.75-7.833,5.75L0.585,24.167z");
    path1.attr({"opacity": 1, "stroke": "none", "fill": "#F4F6F7"});
    userTaskIcon.push(path1);

    var path2 = paper.path("M6,20L6,24");
    path2.attr({"opacity": 1, "stroke": "white", "fill": "none"});
    userTaskIcon.push(path2);

    var path3 = paper.path("M20,20L20,24");
    path3.attr({"opacity": 1, "stroke": "white", "fill": "none"});
    userTaskIcon.push(path3);

    var circle = paper.circle(13.002, 5.916, 5.417);
    circle.attr({"stroke-width": 1, "stroke": "black", "fill": "#000000"});
    userTaskIcon.push(circle);

    var path4 = paper.path("M8.043,7.083c0,0,2.814-2.426,5.376-1.807s4.624-0.693,4.624-0.693 c0.25,1.688,0.042,3.75-1.458,5.584c0,0,1.083,0.75,1.083,1.5s0.125,1.875-1,3s-5.5,1.25-6.75,0S8.668,12.834,8.668,12 s0.583-1.25,1.25-1.917C8.835,9.5,7.419,7.708,8.043,7.083z");
    path4.attr({"opacity": 1, "stroke": "none", "fill": "#F0EFF0"});
    userTaskIcon.push(path4);

    var x = (element.width / 2) - 2;
    var y = (element.height / 2) - 2;
    var circle2 = paper.circle(x, y, 17);
    circle2.attr({"stroke-width": 1, "stroke": "#F0EFF0", "fill": "none"});
    userTaskIcon.push(circle2);

    userTaskIcon.transform("S0.7,0.7" + "T" + (element.x + 2) + "," + (element.y + 2));
    return userTaskIcon;
}
